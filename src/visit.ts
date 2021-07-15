import { Parent, NodeData } from 'unist';

export type VisitCallback = (node: NodeData<Parent>, index: number, parent: NodeData<Parent>) => void;
export default function visit(tree?: NodeData<Parent>, element?: string, callback?: VisitCallback) {
  if (!element || !tree || !callback || typeof callback !== 'function') {
    return
  }
  if (tree.children && Array.isArray(tree.children)) {
    handle(tree.children, element, tree, callback)
  }
}

function handle(tree: NodeData<Parent>[], element: string, parent: NodeData<Parent>, callback: VisitCallback) {
  tree.forEach((item, index) => {
    if (item.type === element) {
      callback(item, index, parent)
      if (Array.isArray(item.children)) {
        handle(item.children, element, item, callback)
      }
    }
  })
}