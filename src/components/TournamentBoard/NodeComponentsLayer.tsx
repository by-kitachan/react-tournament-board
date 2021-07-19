import React, { useMemo, useCallback } from 'react';
import { css } from '@linaria/core';
import {
  MatchingStructureItem,
  TournamentBoardProps,
  NodeRendererProps,
  MatchingResultItem,
  MatchingResultRendererProps,
} from '../../types';
import { NodeStatus, TreeLayout } from './types';

const style = {
  nodeComponentsLayer: css`
    position: absolute;
    top: 0;
    left: 0;
  `,
  node: css`
    position: absolute;
    display: flex;
    align-items: center;
  `,
  bidiRootNodeContainer: css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
  `,
  bidiRootNode: css`
    pointer-events: auto;
  `,
};

export const NodeComponentsLayer = <
  T extends MatchingStructureItem,
  U extends MatchingResultItem
>({
  treeNodeStatus,
  treeLayout,
  rootMatch,
  nodeRenderer,
  matchingResultRenderer,
  matches,
  direction,
  boardSize,
  descenderLinkLengthRatio,
  leafDistance,
  groupDistance,
  leafPadding,
  rootPadding,
}: {
  treeNodeStatus: NodeStatus<T> | [NodeStatus<T>, NodeStatus<T>];
  treeLayout: TreeLayout;
  rootMatch?: NodeStatus['match'];
} & Pick<TournamentBoardProps<T>, 'nodeRenderer' | 'matchingResultRenderer'> &
  Pick<
    Required<TournamentBoardProps<T>>,
    | 'matches'
    | 'direction'
    | 'boardSize'
    | 'descenderLinkLengthRatio'
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

  const propsTree = useMemo((): NodeRendererProps<T, U> => {
    const traverse = (n: NodeStatus<T>): NodeRendererProps<T, U> => {
      const { height, depth } = n;
      return n.children
        ? {
            isLeaf: false,
            isRoot: false,
            height,
            depth,
            children: n.children.map(traverse),
            match: n.match,
          }
        : {
            isLeaf: true,
            isRoot: false,
            height,
            depth,
            competitor: n.leafItem,
            allMatches: matches.filter(({ result }) =>
              result.some(({ id }) => id === n.leafItem.id),
            ),
          };
    };
    return Array.isArray(treeNodeStatus)
      ? {
          isLeaf: false,
          isRoot: true,
          height: rootHeight,
          depth: 0,
          children: treeNodeStatus.map(traverse),
          match: rootMatch,
        }
      : {
          ...(traverse(treeNodeStatus) as NodeRendererProps<T> & {
            isLeaf: false;
          }),
          isRoot: true,
        };
  }, [treeNodeStatus, rootHeight, rootMatch, matches]);

  const UserComponent = useCallback(
    ({
      nodeProps,
      matchResultProps,
      row,
      col,
      matchingResultRow,
      inverse,
      transpose,
    }: {
      nodeProps: NodeRendererProps<T>;
      matchResultProps?: MatchingResultRendererProps<U>;
      row: number;
      col: number;
      matchingResultRow?: number;
      inverse?: boolean;
      transpose?: boolean;
    }) => {
      if (!nodeRenderer && !matchingResultRenderer) {
        return null;
      }
      const posStyle: React.CSSProperties =
        direction === 'vertical'
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
            };
      const colTransposed = transpose ? treeLayout.treeSize - col : col;
      return (
        <>
          <div
            className={style.node}
            style={{
              ...posStyle,
              transform:
                direction === 'vertical'
                  ? `translate(${boardSize - row}px, ${colTransposed}px)`
                  : `translate(${colTransposed}px, ${row}px)`,
            }}
          >
            {nodeRenderer && nodeRenderer(nodeProps)}
          </div>
          {matchingResultRenderer && matchResultProps && (
            <div
              className={style.node}
              style={{
                ...posStyle,
                transform:
                  direction === 'vertical'
                    ? `translate(${
                        boardSize - (matchingResultRow ?? row)
                      }px, ${colTransposed}px)`
                    : `translate(${colTransposed}px, ${matchingResultRow}px)`,
              }}
            >
              {matchingResultRenderer(matchResultProps)}
            </div>
          )}
        </>
      );
    },
    [
      nodeRenderer,
      matchingResultRenderer,
      leafDistance,
      direction,
      boardSize,
      treeLayout,
    ],
  );

  const NodeRenderer: React.VFC<{
    nodeStatus: NodeStatus<T>;
    nodeProps: NodeRendererProps<T>;
    matchResultProps?: MatchingResultRendererProps<U>;
    colOffset: number;
    rowOffset: number;
    inverse?: boolean;
    transpose?: boolean;
    isRoot?: boolean;
    isSubRoot?: boolean;
  }> = ({
    nodeStatus,
    nodeProps,
    matchResultProps,
    colOffset,
    rowOffset,
    inverse,
    transpose,
    isRoot,
    isSubRoot,
  }) => {
    const { size, treeWeight, depth } = nodeStatus;
    const col =
      colOffset +
      size * treeWeight +
      (depth === rootHeight ? groupDistance / 2 : 0);
    const matchingResultRow = isSubRoot
      ? rowOffset + (rootPadding / 4) * (inverse ? 1 : -1)
      : rowOffset + stepSize * descenderLinkLengthRatio * (inverse ? 1 : -1);
    if (!nodeStatus.children) {
      return (
        <UserComponent
          col={col}
          row={rowOffset + (inverse ? -leafPadding : leafPadding)}
          {...{
            nodeProps,
            matchResultProps,
            matchingResultRow,
            inverse,
            transpose,
          }}
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
        {children.map((n, i) => {
          const matchResult = nodeProps.match?.result.find(({ id }) =>
            n.leafIds.includes(id),
          );
          const matchResultProps = matchResult && {
            result: matchResult,
            isWinner: !nodeProps.match?.winnerId
              ? false
              : Array.isArray(nodeProps.match.winnerId)
              ? nodeProps.match.winnerId.some((id) => n.leafIds.includes(id))
              : n.leafIds.includes(nodeProps.match.winnerId),
            height: nodeProps.height,
            depth: nodeProps.depth,
          };
          return (
            <NodeRenderer
              key={n.id}
              nodeStatus={n}
              nodeProps={nodeProps.children![i]}
              colOffset={colOffset + childrenOffset[i] - n.size}
              rowOffset={nextRowOffset}
              {...{ matchResultProps, inverse, transpose }}
            />
          );
        })}
        {!isRoot && (
          <UserComponent
            col={col}
            row={rowOffset}
            {...{
              nodeProps,
              matchResultProps,
              matchingResultRow,
              inverse,
              transpose,
            }}
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
    const matchResultProps = treeNodeStatus.map(
      ({ leafIds }) =>
        propsTree.match && {
          result: propsTree.match.result.find(({ id }) =>
            leafIds.includes(id),
          )!,
          isWinner: !propsTree.match.winnerId
            ? false
            : Array.isArray(propsTree.match.winnerId)
            ? propsTree.match.winnerId.some((id) => leafIds.includes(id))
            : leafIds.includes(propsTree.match.winnerId),
          height: propsTree.height,
          depth: propsTree.depth,
        },
    );
    return (
      <div className={style.nodeComponentsLayer}>
        <NodeRenderer
          nodeStatus={treeNodeStatus[0]}
          nodeProps={propsTree.children![0]}
          matchResultProps={matchResultProps[0]}
          colOffset={Math.max(topLeft - bottomLeft, 0)}
          rowOffset={(boardSize + rootPadding) / 2}
          isSubRoot
        />
        <NodeRenderer
          nodeStatus={treeNodeStatus[1]}
          nodeProps={propsTree.children![1]}
          matchResultProps={matchResultProps[1]}
          colOffset={Math.max(bottomRight - topRight, 0)}
          rowOffset={(boardSize - rootPadding) / 2}
          isSubRoot
          inverse
          transpose
        />
        <div
          className={style.bidiRootNodeContainer}
          style={{
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
            transform:
              direction === 'vertical'
                ? `translate(${boardSize / 2}px, ${rootCol}px)`
                : `translate(${rootCol}px, ${boardSize / 2}px)`,
          }}
        >
          {nodeRenderer && (
            <div className={style.bidiRootNode}>{nodeRenderer(propsTree)}</div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={style.nodeComponentsLayer}>
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
