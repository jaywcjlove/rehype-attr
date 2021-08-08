import { Plugin, Transformer } from 'unified'
import { Parent, NodeData, Node } from 'unist';
import visit from './visit'
import { propertiesHandle, nextChild, prevChild, getCommentObject } from './utils';

export type MdastTransformer = (tree: NodeData<Parent>) => void

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

const rehypeAttrs: Plugin<[RehypeAttrsOptions?]> = (options): Transformer => {
  const opts = { ...defaultOptions, ...options }
  return transformer;
  function transformer(tree: Node<NodeData<Parent>>): void {
    // ????? any
    visit(tree as any, 'element', (node: NodeData<Parent>, index: number, parent: NodeData<Parent>) => {
      const codeNode = node && node.children && Array.isArray(node.children) && node.children[0]
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
      if (/^(em|strong|b|a|i|p|pre|kbd|blockquote|h(1|2|3|4|5|6)|code|table|img|del|ul|ol)$/.test(node.tagName as string) && Array.isArray(parent.children)) {
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
