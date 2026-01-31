import type { TreeNode } from "../types";


export const removeNodeById = (
  nodes: TreeNode[],
  id: string
): { updatedTree: TreeNode[]; removedNode: TreeNode | null } => {
  let removedNode: TreeNode | null = null;

  const newTree = nodes.reduce<TreeNode[]>((acc, node) => {
    if (node.id === id) {
      removedNode = node;
      return acc;
    }

    if (node.children) {
      const result = removeNodeById(node.children, id);
      if (result.removedNode) {
        removedNode = result.removedNode;
        acc.push({ ...node, children: result.updatedTree });
        return acc;
      }
    }

    acc.push(node);
    return acc;
  }, []);

  return { updatedTree: newTree, removedNode };
};


export const insertNode = (
  nodes: TreeNode[],
  parentId: string | null,
  nodeToInsert: TreeNode
): TreeNode[] => {
  if (parentId === null) {
    return [...nodes, nodeToInsert];
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      return {
        ...node,
        isExpanded: true,
        children: [...(node.children || []), nodeToInsert],
      };
    }
    return {
      ...node,
      children: node.children
        ? insertNode(node.children, parentId, nodeToInsert)
        : [],
    };
  });
};

export const isDescendant = (node: TreeNode, targetId: string): boolean => {
  if (!node.children || node.children.length === 0) return false;

  for (const child of node.children) {
    if (child.id === targetId) return true;
    if (isDescendant(child, targetId)) return true;
  }
  return false;
};

export const findTopLevelParent = (
  nodes: TreeNode[],
  id: string,
  parent: TreeNode | null = null
): TreeNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return parent ?? node; 
    }
    if (node.children) {
      const found = findTopLevelParent(node.children, id, parent ?? node);
      if (found) return found;
    }
  }
  return null;
};

