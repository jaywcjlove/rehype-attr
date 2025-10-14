import type { Plugin } from 'unified';
import type { Root, Element, Comment, Properties, Literal, RootContent, ElementContent } from 'hast';
import { visit } from 'unist-util-visit';
import { propertiesHandle, nextChild, prevChild, getCommentObject } from './utils.js';

export type RehypeAttrsOptions = {
  /**
   * ## `data`
   * 
   * ```markdown
   * text
   * <!--rehype:title=Rehype Attrs&abc=2-->
   * ```
   * 👇👇👇👇👇
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
   * 👇👇👇👇👇
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
   * 👇👇👇👇👇
   * ```html
   * <p title="Rehype Attrs">text</p>
   * ```
   * @default `data`
   */
  properties?: 'data' | 'string' | 'attr';
  /**
   * Code block passing parameters
   */
  codeBlockParames?: boolean;
  /** 
   * Optional start delimiter for comments @example `\\{\\*`
   * @default `<!--`
   */
  commentStart?: string;
  /**
   * Optional end delimiter for comments @example `\\*\\}` 
   * @default `-->`
   */
  commentEnd?: string;
}

const rehypeAttrs: Plugin<[RehypeAttrsOptions?], Root> = (options = {}) => {
  const { properties = 'data', codeBlockParames = true, commentStart = "<!--", commentEnd = "-->" } = options;
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (codeBlockParames && node.tagName === 'pre' && node && Array.isArray(node.children) && parent && Array.isArray(parent.children) && parent.children.length > 1) {
        const firstChild = node.children[0] as Element;
        if (firstChild && firstChild.tagName === 'code' && typeof index === 'number') {
          const child = prevChild(parent.children as Literal[], index);
          if (child) {
            const attr = getCommentObject(child, commentStart, commentEnd);
            if (Object.keys(attr).length > 0) {
              node.properties = { ...node.properties, ...{ 'data-type': 'rehyp' } }
              firstChild.properties = propertiesHandle(firstChild.properties, attr, properties) as Properties
            }
          }
        }
      }
      let rootnode = parent as Root
      let testTagName = /^(em|strong|b|a|i|p|pre|kbd|blockquote|h(1|2|3|4|5|6)|code|table|img|del|ul|ol|li)$/.test(node.tagName)
      if ((testTagName || rootnode.type == "root") && parent && Array.isArray(parent.children) && typeof index === 'number') {
        addPropertyToNode(node, parent.children, index, properties, commentStart, commentEnd)
        if (node.tagName == "ul") {
          node.children.forEach((li, _) => {
            if (li.type == "element" && li.tagName == "li") {
              addPropertyToNode(li, li.children, 0, properties, commentStart, commentEnd)
            }
          })
        }
      }
    });
  }
}

function addPropertyToNode(
  node: Element, 
  children: RootContent[] | ElementContent[] = [], 
  index: number, 
  properties: RehypeAttrsOptions['properties'], 
  commentStart = "<!--", 
  commentEnd = "-->"
) {
  const child = nextChild(children, index, "", commentStart, commentEnd)
  if (child) {
    const attr = getCommentObject(child as Comment, commentStart, commentEnd)
    if (Object.keys(attr).length > 0) {
      node.properties = propertiesHandle(node.properties, attr, properties) as Properties
    }
  }
}

export default rehypeAttrs
