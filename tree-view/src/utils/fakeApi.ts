import type { TreeNode } from "../types";
import { v4 as uuid } from "uuid";

export const fakeApiLoad = (): Promise<TreeNode[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: uuid(), name: "Lazy File A" },
        { id: uuid(), name: "Lazy File B" },
      ]);
    }, 1000);
  });
};
