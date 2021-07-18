export type Direction = 'vertical' | 'horizontal';

export type MatchingStructureItem = {
  id: string;
} & {
  [key in string | number | symbol]: any;
};

export type MatchingStructureNode<T extends unknown> =
  | T
  | MatchingStructureNode<T>[];
export type MatchingStructure<T extends unknown> = MatchingStructureNode<T>[];

export type MatchingResultItem = {
  id: string;
} & {
  [key in string | number | symbol]: any;
};

export type MatchingResult<
  T extends MatchingResultItem = MatchingResultItem
> = {
  result: T[];
  winnerId?: string | string[];
};

export type NodeRendererProps<
  T extends MatchingStructureItem = MatchingStructureItem,
  U extends MatchingResultItem = MatchingResultItem
> = {
  height: number;
  depth: number;
} & (
  | {
      isLeaf: false;
      isRoot: boolean;
      competitor?: undefined;
      children: NodeRendererProps<T>[];
      match?: MatchingResult<U>;
    }
  | {
      isLeaf: true;
      isRoot: false;
      competitor: T;
      children?: undefined;
      match?: undefined;
    }
);

export type MatchingResultRendererProps<
  T extends MatchingResultItem = MatchingResultItem
> = {
  result: T;
  isWinner: boolean;
  height: number;
  depth: number;
};

export interface TournamentBoardProps<
  T extends MatchingStructureItem = MatchingStructureItem,
  U extends MatchingResultItem = MatchingResultItem
> {
  competitor: MatchingStructure<T>;
  matches?: MatchingResult<U>[];
  nodeRenderer?: (props: NodeRendererProps<T>) => React.ReactNode;
  matchingResultRenderer?: (
    props: MatchingResultRendererProps<U>,
  ) => React.ReactNode;
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
