export type Direction = 'vertical' | 'horizontal';

export type MatchingStructureItem = {
  id: string;
};

export type MatchingStructureNode =
  | MatchingStructureItem
  | MatchingStructureNode[];
export type MatchingStructure = MatchingStructureNode[];
