import type { CSSProperties } from "react";
import { useState } from "react";
import type { TreeNode } from "../types";
import { v4 as uuid } from "uuid";
import { updateNode, removeNode } from "../utils/treeUtils";
import { fakeApiLoad } from "../utils/fakeApi";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  FiChevronRight,
  FiChevronDown,
  FiFolder,
  FiPlus,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";

interface Props {
  node: TreeNode;
  tree: TreeNode[];
  setTree: React.Dispatch<React.SetStateAction<TreeNode[]>>;
}

const TreeNodeItem: React.FC<Props> = ({ node, tree, setTree }) => {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(node.name);

 
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    transition,
  } = useDraggable({ id: node.id });

  const { setNodeRef: setDropRef } = useDroppable({ id: node.id });

  const { setNodeRef: setChildrenDropRef } = useDroppable({
    id: `${node.id}-children`,
  });

  const style: CSSProperties = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition: transition ?? undefined,
  };

  const toggleNode = async () => {
    updateNode(
      node.id,
      async (n) => {
        if (!n.isExpanded && !n.children?.length) {
          n.isLoading = true;
          setTree([...tree]);

          const children = await fakeApiLoad();
          n.children = children;
          n.isLoading = false;
        }
        n.isExpanded = !n.isExpanded;
      },
      tree,
    );

    setTree([...tree]);
  };

  const addChild = () => {
    const name = prompt("Enter child node name");
    if (!name) return;

    updateNode(
      node.id,
      (n) => {
        n.children = [...(n.children || []), { id: uuid(), name }];
        n.isExpanded = true;
      },
      tree,
    );

    setTree([...tree]);
  };

  const deleteCurrentNode = () => {
    if (!window.confirm("Delete this node and all children?")) return;
    setTree(removeNode(tree, node.id));
  };

  const saveEdit = () => {
    updateNode(node.id, (n) => (n.name = tempName), tree);
    setEditing(false);
    setTree([...tree]);
  };

 return (
  <div style={{ marginLeft: 20 }}>
    
    <div
      ref={setDropRef}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        ...style,
      }}
    >
     
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleNode();
        }}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        {node.isExpanded ? <FiChevronDown /> : <FiChevronRight />}
      </button>

      <FiFolder />

      {editing ? (
        <input
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          onBlur={saveEdit}
          autoFocus
        />
      ) : (
        <span onDoubleClick={() => setEditing(true)}>{node.name}</span>
      )}

      <div style={{ flex: 1 }} />

      
      <span
        ref={setDragRef}
        {...listeners}
        {...attributes}
        style={{ cursor: "grab", display: "flex" }}
      >
        <FiMoreVertical />
      </span>

      <button
        onClick={addChild}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <FiPlus />
      </button>

      <button
        onClick={deleteCurrentNode}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <FiTrash2 />
      </button>
    </div>

    {node.isLoading && <div>Loading...</div>}

    
    {node.isExpanded && (
      <div ref={setChildrenDropRef} style={{ paddingLeft: 20 }}>
        {node.children?.map((child) => (
          <TreeNodeItem
            key={child.id}
            node={child}
            tree={tree}
            setTree={setTree}
          />
        ))}
      </div>
    )}
  </div>
);

};

export default TreeNodeItem;
