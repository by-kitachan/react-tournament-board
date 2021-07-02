import React, { useMemo, useCallback } from 'react';
import { Direction, MatchingStructure } from '../types';
import { SVGLayer, GroupLayer } from './chart/layer';
import { traverseTreeNodeStatus, SubTree, NodeStatus } from './chart/tree';

export interface NodeRendererProps {}

export interface TournamentBoardProps {
  competitor: MatchingStructure;
  nodeRenderer?: (props: NodeRendererProps) => React.ReactNode;
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

type TreeLayout = {
  treeSize: number;
  subTreeSize: {
    topLeft: number;
    topRight: number;
    bottomLeft: number;
    bottomRight: number;
  };
};

export const TreeLinksLayer: React.VFC<
  {
    treeNodeStatus: NodeStatus | [NodeStatus, NodeStatus];
    treeLayout: TreeLayout;
  } & Pick<
    Required<TournamentBoardProps>,
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
      <GroupLayer stroke="white" strokeWidth={2} fill="transparent">
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
      <GroupLayer stroke="white" strokeWidth={2} fill="transparent">
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

export const NodeComponentsLayer: React.VFC<
  {
    treeNodeStatus: NodeStatus | [NodeStatus, NodeStatus];
    treeLayout: TreeLayout;
  } & Pick<
    Required<TournamentBoardProps>,
    | 'nodeRenderer'
    | 'direction'
    | 'boardSize'
    | 'leafDistance'
    | 'groupDistance'
    | 'leafPadding'
    | 'rootPadding'
  >
> = ({
  treeNodeStatus,
  treeLayout,
  nodeRenderer,
  direction,
  boardSize,
  leafDistance,
  groupDistance,
  leafPadding,
  rootPadding,
}) => {
  const stepSize = useMemo(() => {
    if (Array.isArray(treeNodeStatus)) {
      return (
        ((boardSize - rootPadding) / 2 - leafPadding) /
        Math.max(...treeNodeStatus.map((n) => n.height), 1)
      );
    } else {
      return (boardSize - rootPadding - leafPadding) / treeNodeStatus.height;
    }
  }, [treeNodeStatus, boardSize, rootPadding, leafPadding]);

  const UserComponent = useCallback(
    ({
      nodeProps,
      row,
      col,
      inverse,
      transpose,
    }: {
      nodeProps: NodeRendererProps;
      row: number;
      col: number;
      inverse?: boolean;
      transpose?: boolean;
    }) => {
      const colTransposed = transpose ? treeLayout.treeSize - col : col;
      return (
        <div
          style={{
            ...(direction === 'vertical'
              ? {
                  ...(inverse ? { right: 0 } : { left: 0 }),
                  top: -leafDistance / 2,
                  bottom: -leafDistance / 2,
                  flexDirection: 'row',
                }
              : {
                  ...(inverse ? { top: 0 } : { bottom: 0 }),
                  left: -leafDistance / 2,
                  right: -leafDistance / 2,
                  flexDirection: 'column',
                }),
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            transform:
              direction === 'vertical'
                ? `translate(${boardSize - row}px, ${colTransposed}px)`
                : `translate(${colTransposed}px, ${row}px)`,
          }}
        >
          {nodeRenderer(nodeProps)}
        </div>
      );
    },
    [nodeRenderer, leafDistance, direction, boardSize, treeLayout],
  );

  const NodeRenderer: React.VFC<{
    nodeStatus: NodeStatus;
    colOffset: number;
    rowOffset: number;
    inverse?: boolean;
    transpose?: boolean;
    isRoot?: boolean;
  }> = ({
    nodeStatus: { children, size, treeWeight },
    colOffset,
    rowOffset,
    inverse,
    transpose,
    isRoot,
  }) => {
    const col = colOffset + size * treeWeight;
    if (!children) {
      return (
        <UserComponent
          nodeProps={{}}
          col={col + groupDistance / 2}
          row={rowOffset + (inverse ? -leafPadding : leafPadding)}
          {...{ inverse, transpose }}
        />
      );
    }

    const nextRowOffset = rowOffset + (inverse ? -stepSize : stepSize);
    const childrenOffset = children.reduce<number[]>(
      (arr, n, i) => [...arr, n.size + (i > 0 ? arr[i - 1] : 0)],
      [],
    );
    return (
      <>
        {children.map((n, i) => (
          <NodeRenderer
            key={n.id}
            nodeStatus={n}
            colOffset={colOffset + childrenOffset[i] - n.size}
            rowOffset={nextRowOffset}
            {...{ inverse, transpose }}
          />
        ))}
        {!isRoot && (
          <UserComponent
            nodeProps={{}}
            col={col}
            row={rowOffset}
            {...{ inverse, transpose }}
          />
        )}
      </>
    );
  };

  if (Array.isArray(treeNodeStatus)) {
    const { topLeft, bottomLeft } = treeLayout.subTreeSize;
    const rootCol =
      treeNodeStatus[0].size * treeNodeStatus[0].treeWeight +
      Math.max(topLeft - bottomLeft, 0);
    return (
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <NodeRenderer
          nodeStatus={treeNodeStatus[0]}
          colOffset={Math.max(topLeft - bottomLeft, 0)}
          rowOffset={(boardSize + rootPadding) / 2}
          isRoot
        />
        <NodeRenderer
          nodeStatus={treeNodeStatus[1]}
          colOffset={Math.max(bottomLeft - topLeft, 0)}
          rowOffset={(boardSize - rootPadding) / 2}
          isRoot
          inverse
          transpose
        />
        <div
          style={{
            position: 'absolute',
            // inset: -leafDistance / 2,
            ...(direction === 'vertical'
              ? {
                  top: -leafDistance / 2,
                  bottom: -leafDistance / 2,
                  left: -boardSize / 2,
                  right: -boardSize / 2,
                  flexDirection: 'row',
                }
              : {
                  top: -boardSize / 2,
                  bottom: -boardSize / 2,
                  left: -leafDistance / 2,
                  right: -leafDistance / 2,
                  flexDirection: 'column',
                }),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform:
              direction === 'vertical'
                ? `translate(${boardSize / 2}px, ${rootCol}px)`
                : `translate(${rootCol}px, ${boardSize / 2}px)`,
            pointerEvents: 'none',
          }}
        >
          <div style={{ pointerEvents: 'auto' }}>{nodeRenderer({})}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <NodeRenderer
          nodeStatus={treeNodeStatus}
          colOffset={0}
          rowOffset={rootPadding}
          isRoot
        />
        <UserComponent
          nodeProps={{}}
          col={treeNodeStatus.size * treeNodeStatus.treeWeight}
          row={0}
          inverse
        />
      </div>
    );
  }
};

export const TournamentBoard: React.VFC<TournamentBoardProps> = ({
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
