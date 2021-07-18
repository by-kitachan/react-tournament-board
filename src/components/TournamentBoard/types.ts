import { MatchingStructureItem, MatchingResult } from '../../types';

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
      match?: MatchingResult;
    }
  | {
      children?: undefined;
      leafItem: T;
      match?: undefined;
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
