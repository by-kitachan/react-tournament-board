export type NodeStatus = {
  id: string;
  height: number;
  leafIds: string[];
  size: number;
  treeWeight: number;
  children?: NodeStatus[];
};

export type TreeLayout = {
  treeSize: number;
  subTreeSize: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
};
