import React, { useMemo } from 'react';
import { Direction, MatchingStructure } from '../types';
import { SVGLayer, GroupLayer } from './chart/layer';
import { traverseTreeNodeStatus, SubTree } from './chart/tree';

export interface TournamentBoardProps {
  competitor: MatchingStructure;
  direction?: Direction;
  boardSize?: number;
  descenderLinkLengthRatio?: number;
  ascenderLinkLengthRatio?: number;
  leafDistance?: number;
  groupDistance?: number;
  leafPadding?: number;
  rootPadding?: number;
}

export const TournamentBoard: React.VFC<TournamentBoardProps> = ({
  competitor,
  direction = 'vertical',
  boardSize = 500,
  descenderLinkLengthRatio = 0.7,
  ascenderLinkLengthRatio = 0.3,
  leafDistance = 30,
  groupDistance = 15,
  leafPadding = 30,
  rootPadding = 30,
}) => {
  const treeNodeStatus = useMemo(() => traverseTreeNodeStatus(competitor), [
    competitor,
  ]);

  const totalCompetitorPlacingSize =
    treeNodeStatus.leafNum * leafDistance +
    treeNodeStatus.groupNum * groupDistance;
  const svgSize =
    direction === 'vertical'
      ? { width: boardSize, height: totalCompetitorPlacingSize }
      : { width: totalCompetitorPlacingSize, height: boardSize };
  const treeSize = boardSize - rootPadding - leafPadding;
  return (
    <div>
      <SVGLayer {...svgSize}>
        <GroupLayer
          stroke="white"
          strokeWidth={2}
          fill="transparent"
          transform={
            direction === 'vertical'
              ? `translate(${leafPadding} 0)`
              : `translate(0 ${rootPadding})`
          }
        >
          <SubTree
            treeNodeStatus={treeNodeStatus}
            treeSize={treeSize}
            {...{
              direction,
              descenderLinkLengthRatio,
              ascenderLinkLengthRatio,
              leafDistance,
              groupDistance,
            }}
          />
        </GroupLayer>
      </SVGLayer>
    </div>
  );
};
