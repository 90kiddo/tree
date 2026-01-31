import type { TreeNode } from "../types";

export const updateNode = (
  id: string,
  updater: (node: TreeNode) => void,
  nodes: TreeNode[]
) => {
  for (const node of nodes) {
    if (node.id === id) {
      updater(node);
      return;
    }
    if (node.children) updateNode(id, updater, node.children);
  }
};

export const removeNode = (nodes: TreeNode[], id: string): TreeNode[] => {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, id) : [],
    }));
};
