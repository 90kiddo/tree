import { useState } from "react";
import type { TreeNode } from "../types";
import { initialTree } from "../mockData";
import TreeNodeItem from "./TreeNodeItem";
import { DndContext, pointerWithin } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { isDescendant, removeNodeById, insertNode } from "../utils/treeDnD";


const TreeView = () => {
  const [tree, setTree] = useState<TreeNode[]>(initialTree);

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  console.log("DRAG END", { active: active.id, over: over?.id });

  if (!over || active.id === over.id) return;

  let targetId = over.id as string;
  if (targetId.endsWith("-children")) {
    targetId = targetId.replace("-children", "");
  }

  console.log("TARGET:", targetId);



  const { updatedTree, removedNode } = removeNodeById(tree, active.id as string);
  if (!removedNode) return;

  if (isDescendant(removedNode, targetId)) {
    console.log("❌ Blocked: Dropping into own child");
    return;
  }

  console.log("✅ Moving node");

  const newTree = insertNode(updatedTree, targetId, removedNode);
  setTree(newTree);
};




  return (
    <DndContext collisionDetection={pointerWithin} onDragEnd={handleDragEnd}>
      {tree.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          tree={tree}
          setTree={setTree}
        />
      ))}
    </DndContext>
  );
};

export default TreeView;
