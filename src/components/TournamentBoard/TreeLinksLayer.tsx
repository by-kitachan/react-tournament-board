import React from 'react';
import { TournamentBoardProps } from '../../types';
import { GroupLayer } from '../chart/layer';
import { SubTree } from './tree';
import { NodeStatus, TreeLayout } from './types';

const defaultLayerProps: React.SVGProps<SVGGElement> = {
  fill: 'transparent',
  stroke: 'black',
  strokeWidth: 1,
};

export const TreeLinksLayer: React.VFC<
  {
    treeNodeStatus: NodeStatus | [NodeStatus, NodeStatus];
    treeLayout: TreeLayout;
    layerProps: React.SVGProps<SVGGElement>;
  } & Pick<
    Required<TournamentBoardProps>,
    | 'matches'
    | 'direction'
    | 'boardSize'
    | 'descenderLinkLengthRatio'
    | 'ascenderLinkLengthRatio'
    | 'leafDistance'
    | 'groupDistance'
    | 'leafPadding'
    | 'rootPadding'
  >
> = ({
  treeNodeStatus,
  treeLayout,
  layerProps,
  matches,
  direction,
  boardSize,
  descenderLinkLengthRatio,
  ascenderLinkLengthRatio,
  leafDistance,
  groupDistance,
  leafPadding,
  rootPadding,
}) => {
  if (Array.isArray(treeNodeStatus)) {
    const { topLeft, topRight, bottomLeft } = treeLayout.subTreeSize;
    return (
      <GroupLayer {...defaultLayerProps} {...layerProps}>
        <GroupLayer
          transform={
            direction === 'vertical'
              ? `translate(${leafPadding} ${Math.max(topLeft - bottomLeft, 0)})`
              : `translate(${Math.max(topLeft - bottomLeft, 0)} ${
                  (boardSize + rootPadding) / 2
                })`
          }
        >
          <SubTree
            treeNodeStatus={treeNodeStatus[0]}
            treeSize={(boardSize - rootPadding) / 2 - leafPadding}
            {...{
              direction,
              descenderLinkLengthRatio,
              ascenderLinkLengthRatio,
              leafDistance,
              groupDistance,
            }}
          />
        </GroupLayer>
        <GroupLayer
          transform={
            direction === 'vertical'
              ? `rotate(180 ${boardSize / 2} ${
                  (topLeft + topRight) / 2 + Math.max(bottomLeft - topLeft, 0)
                }) translate(${leafPadding} ${Math.max(
                  bottomLeft - topLeft,
                  0,
                )})`
              : `rotate(180 ${
                  (topLeft + topRight) / 2 + Math.max(bottomLeft - topLeft, 0)
                } ${boardSize / 2}) translate(${Math.max(
                  bottomLeft - topLeft,
                  0,
                )} ${(boardSize + rootPadding) / 2})`
          }
        >
          <SubTree
            treeNodeStatus={treeNodeStatus[1]}
            treeSize={(boardSize - rootPadding) / 2 - leafPadding}
            {...{
              direction,
              descenderLinkLengthRatio,
              ascenderLinkLengthRatio,
              leafDistance,
              groupDistance,
            }}
          />
        </GroupLayer>
      </GroupLayer>
    );
  } else {
    return (
      <GroupLayer {...defaultLayerProps} {...layerProps}>
        <GroupLayer
          transform={
            direction === 'vertical'
              ? `translate(${leafPadding} 0)`
              : `translate(0 ${rootPadding})`
          }
        >
          <SubTree
            treeNodeStatus={treeNodeStatus}
            treeSize={boardSize - rootPadding - leafPadding}
            {...{
              direction,
              descenderLinkLengthRatio,
              ascenderLinkLengthRatio,
              leafDistance,
              groupDistance,
            }}
          />
        </GroupLayer>
      </GroupLayer>
    );
  }
};
