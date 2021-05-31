import { Root, Parent } from 'ts-mdast'
import {Plugin} from 'unified'
import visit from './visit'
import { propertiesHandle, nextChild, prevChild, getCommentObject } from './utils'

export type MdastTransformer = (tree: Root) => void

export type RehypeAttrsOptions = {
  /**
   * ## `data`
   * 
   * ```markdown
   * text
   * <!--rehype:title=Rehype Attrs&abc=2-->
   * ```
   * 
   * ⇣⇣⇣⇣⇣⇣
   * 
   * ```html
   * <p data-config="data-config='[object Object]'">text</p>
   * ```
   * 
   * ## `string`
   * 
   * ```markdown
   * text
   * <!--rehype:title=Rehype Attrs-->
   * ```
   * 
   * ⇣⇣⇣⇣⇣⇣
   * 
   * ```html
   * <p data-config="{&#x22;title&#x22;:&#x22;Rehype Attrs&#x22;,&#x22;rehyp&#x22;:true}">text</p>
   * ```
   * 
   * ## attr
   * 
   * ```markdown
   * text
   * <!--rehype:title=Rehype Attrs-->
   * ```
   * ⇣⇣⇣⇣⇣⇣
   * ```html
   * <p title="Rehype Attrs">text</p>
   * ```
   */
  properties: 'data' | 'string' | 'attr'
}

const defaultOptions: RehypeAttrsOptions = {
  properties: 'data'
}

const rehypeAttrs: Plugin<[RehypeAttrsOptions?]> = (options): MdastTransformer =>{
  const opts = { ...defaultOptions, ...options }
  return transformer
  function transformer(tree: Root) {
    visit(tree, 'element', (node: Root, index: number, parent: Parent) => {
      const codeNode = node && node.children ? node.children[0] as any : null
      if (node.tagName === 'pre' && codeNode && codeNode.tagName === 'code' && Array.isArray(parent.children) && parent.children.length > 1) {
        const child = prevChild(parent.children, index)
        if (child) {
          const attr = getCommentObject(child)
          if (Object.keys(attr).length > 0) {
            node.properties = { ...(node.properties as any), ...{ 'data-type': 'rehyp' } }
            codeNode.properties = propertiesHandle(codeNode.properties, attr, opts.properties)
          }
        }
      }
      if (/^(em|strong|b|a|i|p|pre|blockquote|h(1|2|3|4|5|6)|code|table|img|del|ul|ol)$/.test(node.tagName as string)) {
        const child = nextChild(parent.children, index)
        if (child) {
          const attr = getCommentObject(child)
          if (Object.keys(attr).length > 0) {
            node.properties = propertiesHandle(node.properties as any, attr, opts.properties)
          }
        }
      }
    })
  }
}


export default rehypeAttrs
