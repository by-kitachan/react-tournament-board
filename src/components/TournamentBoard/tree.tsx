import md5 from 'md5';
import React from 'react';
import {
  Direction,
  MatchingStructureNode,
  MatchingStructureItem,
  MatchingResult,
  MatchingResultItem,
  TournamentBoardProps,
} from '../../types';
import { GroupLayer } from '../chart/layer';
import { Link } from '../chart/line';
import { NodeStatus } from './types';

export const traverseTreeNodeStatus = <
  T extends MatchingStructureItem,
  U extends MatchingResultItem
>({
  node,
  matches,
  leafDistance,
  groupDistance,
  depth,
}: {
  node: MatchingStructureNode<T>;
  matches: MatchingResult<U>[];
  leafDistance: number;
  groupDistance: number;
  depth: number;
}): NodeStatus<T> => {
  if (!Array.isArray(node)) {
    return {
      id: md5(node.id),
      height: 0,
      depth,
      leafIds: [node.id],
      size: leafDistance,
      treeWeight: 0.5,
      leafItem: node,
    };
  }
  const children = node.map((node) =>
    traverseTreeNodeStatus({
      node,
      matches,
      leafDistance,
      groupDistance,
      depth: depth + 1,
    }),
  );
  const height = Math.max(...children.map((n) => n.height)) + 1;
  const ss = children.map((n) => n.size);
  const size = ss.reduce((sum, s) => sum + s, 0);
  const rootLinkSize =
    (size +
      ss[0] * children[0].treeWeight -
      ss[ss.length - 1] * (1 - children[ss.length - 1].treeWeight)) /
    2;
  const match = matches.find((match) => {
    const block: number[] = [];
    return match.result.every(({ id }) => {
      const index = children.findIndex((node) => node.leafIds.includes(id));
      const found = index >= 0 && !block.includes(index);
      block.push(index);
      return found;
    });
  });
  return {
    id: children.reduce((id, n) => md5(`${id}${n.id}`), ''),
    height,
    depth,
    leafIds: children.reduce<string[]>((arr, n) => [...arr, ...n.leafIds], []),
    size: size + (height === 1 ? groupDistance : 0),
    treeWeight: rootLinkSize / size,
    children,
    match,
  };
};

const TreeNode: React.VFC<{
  leavesPos: number[];
  rootPos: number;
  descenderLinkLength: number;
  ascenderLinkLength: number;
  direction: Direction;
}> = ({
  leavesPos,
  rootPos,
  descenderLinkLength,
  ascenderLinkLength,
  direction,
}) => {
  return (
    <GroupLayer>
      {leavesPos.map((p, i) => (
        <Link
          key={i}
          points={
            direction === 'vertical'
              ? [
                  { x: 0, y: p },
                  { x: descenderLinkLength, y: p },
                  { x: descenderLinkLength, y: rootPos },
                  { x: descenderLinkLength + ascenderLinkLength, y: rootPos },
                ]
              : [
                  { x: p, y: descenderLinkLength + ascenderLinkLength },
                  { x: p, y: ascenderLinkLength },
                  { x: rootPos, y: ascenderLinkLength },
                  { x: rootPos, y: 0 },
                ]
          }
        />
      ))}
    </GroupLayer>
  );
};

export const SubTree: React.VFC<
  {
    treeNodeStatus: NodeStatus;
    treeSize: number;
    showWinnerLinks: boolean;
  } & Required<
    Pick<
      TournamentBoardProps,
      | 'direction'
      | 'descenderLinkLengthRatio'
      | 'ascenderLinkLengthRatio'
      | 'leafDistance'
      | 'groupDistance'
    >
  >
> = ({
  treeNodeStatus,
  treeSize,
  showWinnerLinks,
  direction,
  descenderLinkLengthRatio,
  ascenderLinkLengthRatio,
  leafDistance,
  groupDistance,
}) => {
  const linkLength = treeSize / treeNodeStatus.height;
  const descenderLinkLength = linkLength * descenderLinkLengthRatio;
  const ascenderLinkLength = linkLength * ascenderLinkLengthRatio;

  const TreeGroups: React.VFC<
    {
      nodeStatus: NodeStatus<MatchingStructureItem>;
      isWinner?: boolean;
    } & React.SVGProps<SVGGElement>
  > = ({
    nodeStatus: { height, children, size, treeWeight, match },
    isWinner,
    ...other
  }) => {
    if (!children) {
      return null;
    }
    const accSize = children.reduce<number[]>(
      (arr, n, i) => [...arr, n.size + (i > 0 ? arr[i - 1] : 0)],
      [],
    );
    const groupSizeOffset = height === 1 ? groupDistance / 2 : 0;
    const winnerIds = children.flatMap<string>((n) => {
      return match?.winnerId &&
        (Array.isArray(match.winnerId)
          ? match.winnerId.some((id) => n.leafIds.includes(id))
          : n.leafIds.includes(match.winnerId))
        ? n.id
        : [];
    });
    const leavesPos = children.flatMap<number>((n, i) => {
      const pos =
        n.size * n.treeWeight + groupSizeOffset + (i > 0 ? accSize[i - 1] : 0);
      if (!showWinnerLinks || (children.length === 1 && isWinner)) {
        return pos;
      }
      return winnerIds.includes(n.id) ? pos : [];
    });
    const rootPos = size * treeWeight;
    return (
      <GroupLayer {...other}>
        {children.map((n, i) => (
          <TreeGroups
            key={n.id}
            nodeStatus={n}
            isWinner={
              children.length === 1 ? isWinner : winnerIds.includes(n.id)
            }
            transform={
              direction === 'vertical'
                ? `translate(0 ${i > 0 ? accSize[i - 1] : 0})`
                : `translate(${i > 0 ? accSize[i - 1] : 0} 0)`
            }
          />
        ))}
        <GroupLayer
          transform={
            direction === 'vertical'
              ? `translate(${linkLength * (height - 1)} 0)`
              : `translate(0 ${linkLength * (treeNodeStatus.height - height)})`
          }
        >
          <TreeNode
            {...{
              leavesPos,
              rootPos,
              descenderLinkLength,
              ascenderLinkLength,
              direction,
            }}
          />
        </GroupLayer>
      </GroupLayer>
    );
  };
  return <TreeGroups nodeStatus={treeNodeStatus} />;
};
