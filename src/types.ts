export type Direction = 'vertical' | 'horizontal';

export type MatchingStructureItem = {
  id: string;
};

export type MatchingStructureNode<T extends unknown> =
  | T
  | MatchingStructureNode<T>[];
export type MatchingStructure<T extends unknown> = MatchingStructureNode<T>[];

export type NodeRendererProps<
  T extends MatchingStructureItem = MatchingStructureItem
> = {
  height: number;
  depth: number;
} & (
  | {
      isLeaf: false;
      isRoot: boolean;
      competitor?: undefined;
      children: NodeRendererProps<T>[];
    }
  | {
      isLeaf: true;
      isRoot: false;
      competitor: T;
      children?: undefined;
    }
);

export interface TournamentBoardProps<
  T extends MatchingStructureItem = MatchingStructureItem
> {
  competitor: MatchingStructure<T>;
  nodeRenderer?: (props: NodeRendererProps<T>) => React.ReactNode;
  treeLinksLayerProps?: React.SVGProps<SVGGElement>;
  direction?: Direction;
  boardSize?: number;
  descenderLinkLengthRatio?: number;
  ascenderLinkLengthRatio?: number;
  leafDistance?: number;
  groupDistance?: number;
  leafPadding?: number;
  rootPadding?: number;
  bidirectionalTree?: boolean;
}
