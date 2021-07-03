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
  treeNodeStatus: NodeStatus<T> | [NodeStatus<T>, NodeStatus<T>];
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
  const rootHeight = useMemo(
    () =>
      Array.isArray(treeNodeStatus)
        ? Math.max(...treeNodeStatus.map((n) => n.height)) + 1
        : treeNodeStatus.height,
    [],
  );
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

  const propsTree = useMemo((): NodeRendererProps<T> => {
    const traverse = (n: NodeStatus<T>): NodeRendererProps<T> => {
      const { height, depth } = n;
      return n.children
        ? {
            isLeaf: false,
            isRoot: false,
            height,
            depth,
            children: n.children.map(traverse),
          }
        : {
            isLeaf: true,
            isRoot: false,
            height,
            depth,
            competitor: n.leafItem,
          };
    };
    return Array.isArray(treeNodeStatus)
      ? {
          isLeaf: false,
          isRoot: true,
          height: rootHeight,
          depth: 0,
          children: treeNodeStatus.map(traverse),
        }
      : {
          ...(traverse(treeNodeStatus) as NodeRendererProps<T> & {
            isLeaf: false;
          }),
          isRoot: true,
        };
  }, [treeNodeStatus, rootHeight]);
  console.log(propsTree);

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
    nodeStatus: NodeStatus<T>;
    nodeProps: NodeRendererProps<T>;
    colOffset: number;
    rowOffset: number;
    inverse?: boolean;
    transpose?: boolean;
    isRoot?: boolean;
  }> = ({
    nodeStatus,
    nodeProps,
    colOffset,
    rowOffset,
    inverse,
    transpose,
    isRoot,
  }) => {
    const { size, treeWeight, height, depth } = nodeStatus;
    const col =
      colOffset +
      size * treeWeight +
      (depth === rootHeight ? groupDistance / 2 : 0);
    if (!nodeStatus.children) {
      return (
        <UserComponent
          nodeProps={{
            isLeaf: true,
            isRoot: false,
            height,
            depth,
            competitor: nodeStatus.leafItem,
          }}
          col={col}
          row={rowOffset + (inverse ? -leafPadding : leafPadding)}
          {...{ inverse, transpose }}
        />
      );
    }
    const { children } = nodeStatus;
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
            nodeProps={nodeProps.children![i]}
            colOffset={colOffset + childrenOffset[i] - n.size}
            rowOffset={nextRowOffset}
            {...{ inverse, transpose }}
          />
        ))}
        {!isRoot && (
          <UserComponent
            col={col}
            row={rowOffset}
            {...{ nodeProps, inverse, transpose }}
          />
        )}
      </>
    );
  };

  if (Array.isArray(treeNodeStatus)) {
    const {
      topLeft,
      bottomLeft,
      bottomRight,
      topRight,
    } = treeLayout.subTreeSize;
    const rootCol =
      treeNodeStatus[0].size * treeNodeStatus[0].treeWeight +
      Math.max(topLeft - bottomLeft, 0);
    return (
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <NodeRenderer
          nodeStatus={treeNodeStatus[0]}
          nodeProps={propsTree.children![0]}
          colOffset={Math.max(topLeft - bottomLeft, 0)}
          rowOffset={(boardSize + rootPadding) / 2}
        />
        <NodeRenderer
          nodeStatus={treeNodeStatus[1]}
          nodeProps={propsTree.children![1]}
          colOffset={Math.max(bottomRight - topRight, 0)}
          rowOffset={(boardSize - rootPadding) / 2}
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
          <div style={{ pointerEvents: 'auto' }}>{nodeRenderer(propsTree)}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <NodeRenderer
          nodeStatus={treeNodeStatus}
          nodeProps={propsTree}
          colOffset={0}
          rowOffset={rootPadding}
          isRoot
        />
        <UserComponent
          nodeProps={propsTree}
          col={treeNodeStatus.size * treeNodeStatus.treeWeight}
          row={0}
          inverse
        />
      </div>
    );
  }
};
