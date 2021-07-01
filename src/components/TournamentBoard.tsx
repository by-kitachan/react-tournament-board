import React, { useMemo } from 'react';
import { Direction, MatchingStructure } from '../types';
import { SVGLayer, GroupLayer } from './chart/layer';
import { traverseTreeNodeStatus, SubTree, NodeStatus } from './chart/tree';

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
  bidirectionalTree?: boolean;
}

export const TournamentBoard: React.VFC<TournamentBoardProps> = ({
  competitor,
  direction = 'horizontal',
  boardSize = 500,
  descenderLinkLengthRatio = 0.7,
  ascenderLinkLengthRatio = 0.3,
  leafDistance = 30,
  groupDistance = 15,
  leafPadding = 30,
  rootPadding = 30,
  bidirectionalTree = false,
}) => {
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
  console.log(treeNodeStatus);

  const size = useMemo(() => {
    if (subTreeStatus) {
      const bidi = {
        topLeft: subTreeStatus[1].size * (1 - subTreeStatus[1].treeWeight),
        topRight: subTreeStatus[1].size * subTreeStatus[1].treeWeight,
        bottomLeft: subTreeStatus[0].size * subTreeStatus[0].treeWeight,
        bottomRight: subTreeStatus[0].size * (1 - subTreeStatus[0].treeWeight),
      };
      const left = Math.max(bidi.topLeft, bidi.bottomLeft);
      const right = Math.max(bidi.topRight, bidi.bottomRight);
      return {
        svg:
          direction === 'vertical'
            ? { width: boardSize, height: left + right }
            : { width: left + right, height: boardSize },
        bidi: {
          ...bidi,
        },
      };
    } else {
      return {
        svg:
          direction === 'vertical'
            ? { width: boardSize, height: treeNodeStatus.size }
            : { width: treeNodeStatus.size, height: boardSize },
        bidi: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 0,
          bottomRight: 0,
        },
      };
    }
  }, [
    subTreeStatus,
    treeNodeStatus,
    direction,
    boardSize,
    leafDistance,
    groupDistance,
  ]);
  console.log(size);

  return (
    <div>
      <SVGLayer {...size.svg}>
        <GroupLayer stroke="white" strokeWidth={2} fill="transparent">
          {subTreeStatus ? (
            <>
              <GroupLayer
                transform={
                  direction === 'vertical'
                    ? `translate(${leafPadding} ${Math.max(
                        size.bidi.topLeft - size.bidi.bottomLeft,
                        0,
                      )})`
                    : `translate(${Math.max(
                        size.bidi.topLeft - size.bidi.bottomLeft,
                        0,
                      )} ${(boardSize + rootPadding) / 2})`
                }
              >
                <SubTree
                  treeNodeStatus={subTreeStatus[0]}
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
                    ? `rotate(180 ${size.svg.width / 2} ${
                        (size.bidi.topLeft + size.bidi.topRight) / 2 +
                        Math.max(size.bidi.bottomLeft - size.bidi.topLeft, 0)
                      }) translate(${leafPadding} ${Math.max(
                        size.bidi.bottomLeft - size.bidi.topLeft,
                        0,
                      )})`
                    : `rotate(180 ${
                        (size.bidi.topLeft + size.bidi.topRight) / 2 +
                        Math.max(size.bidi.bottomLeft - size.bidi.topLeft, 0)
                      } ${size.svg.height / 2}) translate(${Math.max(
                        size.bidi.bottomLeft - size.bidi.topLeft,
                        0,
                      )} ${(boardSize + rootPadding) / 2})`
                }
              >
                <SubTree
                  treeNodeStatus={subTreeStatus[1]}
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
            </>
          ) : (
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
          )}
        </GroupLayer>
      </SVGLayer>
    </div>
  );
};
