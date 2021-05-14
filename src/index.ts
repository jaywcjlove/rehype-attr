import { Root, Parent } from 'ts-mdast'
import visit from './visit'
import { getComment, propertiesHandle } from './utils'

export type MdastTransformer = (tree: Root) => void

export type RehypeAttrsOptions = {
  /**
   * ## `data`
   * 
   * ```markdown
   * <!--rehype:title=Rehype Attrs&abc=2-->
   * text
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
   * <!--rehype:title=Rehype Attrs-->
   * text
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
   * <!--rehype:title=Rehype Attrs-->
   * text
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

export default function rehypeAttrs(options: RehypeAttrsOptions): MdastTransformer {
  const opts = { ...defaultOptions, ...options }
  return transformer
  function transformer(tree: Root) {
    visit(tree, 'element', (node: Root, index: number, parent: Parent) => {
      const codeNode = node && node.children ? node.children[0] as any : null
      if (node.tagName === 'pre' && codeNode && codeNode.tagName === 'code' && Array.isArray(parent.children) && parent.children.length > 1) {
        const attr = getComment(parent.children, index, true)
        if (Object.keys(attr).length > 0) {
          codeNode.properties = propertiesHandle(codeNode.properties, attr, opts.properties)
        }
      }
      if (/^(em|strong|a|p|h1|h(2|3|4|5|6)|code|img|del|ul)$/.test(node.tagName as string)) {
        const attr = getComment(parent.children, index)
        if (Object.keys(attr).length > 0) {
          node.properties = propertiesHandle(node.properties as any, attr, opts.properties)
        }
      }
    })
  }
}
