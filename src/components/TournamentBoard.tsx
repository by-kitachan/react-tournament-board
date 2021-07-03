import React, { useMemo } from 'react';
import { MatchingStructureItem, TournamentBoardProps } from '../types';
import { SVGLayer } from './chart/layer';
import { traverseTreeNodeStatus } from './TournamentBoard/tree';
import { NodeComponentsLayer } from './TournamentBoard/NodeComponentsLayer';
import { TreeLinksLayer } from './TournamentBoard/TreeLinksLayer';
import { NodeStatus, TreeLayout } from './TournamentBoard/types';

export const TournamentBoard = <
  T extends MatchingStructureItem = MatchingStructureItem
>({
  competitor,
  nodeRenderer,
  direction = 'horizontal',
  boardSize = 500,
  descenderLinkLengthRatio = 0.7,
  ascenderLinkLengthRatio = 0.3,
  leafDistance = 30,
  groupDistance = 15,
  leafPadding = 30,
  rootPadding = 30,
  bidirectionalTree = false,
}: TournamentBoardProps<T>): React.ReactElement<
  TournamentBoardProps<T>
> | null => {
  const treeNodeStatus = useMemo(
    () =>
      traverseTreeNodeStatus({ node: competitor, leafDistance, groupDistance }),
    [competitor],
  );
  let subTreeStatus: [NodeStatus, NodeStatus] | undefined;
  if (bidirectionalTree) {
    const [a, b] = treeNodeStatus.children ?? [];
    if (!a || !b || treeNodeStatus.children?.length !== 2) {
      throw new Error(
        'There must be two competitors in the final when bidirectionalTree is true.',
      );
    }
    subTreeStatus = [a, b];
  }

  const treeLayout = useMemo((): TreeLayout => {
    if (subTreeStatus) {
      const subTreeSize = {
        topLeft: subTreeStatus[1].size * (1 - subTreeStatus[1].treeWeight),
        topRight: subTreeStatus[1].size * subTreeStatus[1].treeWeight,
        bottomLeft: subTreeStatus[0].size * subTreeStatus[0].treeWeight,
        bottomRight: subTreeStatus[0].size * (1 - subTreeStatus[0].treeWeight),
      };
      const left = Math.max(subTreeSize.topLeft, subTreeSize.bottomLeft);
      const right = Math.max(subTreeSize.topRight, subTreeSize.bottomRight);
      return {
        treeSize: left + right,
        subTreeSize,
      };
    } else {
      return {
        treeSize: treeNodeStatus.size,
        subTreeSize: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
        },
      };
    }
  }, [subTreeStatus, treeNodeStatus]);

  return (
    <div style={{ position: 'relative' }}>
      <SVGLayer
        {...(direction === 'vertical'
          ? { width: boardSize, height: treeLayout.treeSize }
          : { width: treeLayout.treeSize, height: boardSize })}
      >
        <TreeLinksLayer
          treeNodeStatus={subTreeStatus || treeNodeStatus}
          {...{
            treeLayout,
            direction,
            boardSize,
            descenderLinkLengthRatio,
            ascenderLinkLengthRatio,
            leafDistance,
            groupDistance,
            leafPadding,
            rootPadding,
          }}
        />
      </SVGLayer>
      {nodeRenderer && (
        <NodeComponentsLayer
          treeNodeStatus={subTreeStatus || treeNodeStatus}
          {...{
            treeLayout,
            nodeRenderer,
            direction,
            boardSize,
            leafDistance,
            groupDistance,
            leafPadding,
            rootPadding,
          }}
        />
      )}
    </div>
  );
};
TournamentBoard.displayName = 'TournamentBoard';
