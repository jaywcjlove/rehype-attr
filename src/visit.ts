import { Root, Parent, Content } from 'ts-mdast'

export type VisitCallback = (node: Root | Content | Parent, index: number, parent: Parent | Content) => void

export default function visit(tree: Root, element: string, callback: VisitCallback) {
  if (!element || !tree || !callback || typeof callback !== 'function') {
    return
  }
  if (tree.children && Array.isArray(tree.children)) {
    handle(tree.children, element, tree, callback)
  }
}

function handle(tree: Content[], element: string, parent: Parent | Content, callback: VisitCallback) {
  tree.forEach((item, index) => {
    if (item.type === element) {
      callback(item, index, parent)
      if (Array.isArray(item.children)) {
        handle(item.children, element, item, callback)
      }
    }
  })
}