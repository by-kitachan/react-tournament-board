import { MatchingStructureItem } from '../../types';

export type NodeStatus<T = MatchingStructureItem> = {
  id: string;
  height: number;
  depth: number;
  leafIds: string[];
  size: number;
  treeWeight: number;
} & (
  | {
      children: NodeStatus<T>[];
      leafItem?: undefined;
    }
  | {
      children?: undefined;
      leafItem: T;
    }
);

export type TreeLayout = {
  treeSize: number;
  subTreeSize: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
};
