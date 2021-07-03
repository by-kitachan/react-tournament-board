export type Direction = 'vertical' | 'horizontal';

export type MatchingStructureItem = {
  id: string;
};

export type MatchingStructureNode<
  T extends MatchingStructureItem = MatchingStructureItem
> = T | MatchingStructureNode<T>[];
export type MatchingStructure<
  T extends MatchingStructureItem = MatchingStructureItem
> = MatchingStructureNode<T>[];

export type NodeRendererProps<
  T extends MatchingStructureItem = MatchingStructureItem
> = {};

export interface TournamentBoardProps<
  T extends MatchingStructureItem = MatchingStructureItem
> {
  competitor: MatchingStructure<T>;
  nodeRenderer?: (props: NodeRendererProps<T>) => React.ReactNode;
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
