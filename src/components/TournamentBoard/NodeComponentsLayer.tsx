import React, { useMemo, useCallback } from 'react';
import {
  MatchingStructureItem,
  TournamentBoardProps,
  NodeRendererProps,
} from '../../types';
import { NodeStatus, TreeLayout } from './types';

export const NodeComponentsLayer = <T extends MatchingStructureItem>({
  treeNodeStatus,
  treeLayout,
  nodeRenderer,
  direction,
  boardSize,
  leafDistance,
  groupDistance,
  leafPadding,
  rootPadding,
}: {
  treeNodeStatus: NodeStatus | [NodeStatus, NodeStatus];
  treeLayout: TreeLayout;
} & Pick<
  Required<TournamentBoardProps<T>>,
  | 'nodeRenderer'
  | 'direction'
  | 'boardSize'
  | 'leafDistance'
  | 'groupDistance'
  | 'leafPadding'
  | 'rootPadding'
>): React.ReactElement | null => {
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
      nodeProps: NodeRendererProps<T>;
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
