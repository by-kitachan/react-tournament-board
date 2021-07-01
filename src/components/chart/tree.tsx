import md5 from 'md5';
import React from 'react';
import { Direction, MatchingStructureNode } from '../../types';
import { TournamentBoardProps } from '../TournamentBoard';
import { GroupLayer } from './layer';
import { Link } from './line';

export type NodeStatus = {
  id: string;
  height: number;
  leafIds: string[];
  size: number;
  treeWeight: number;
  children?: NodeStatus[];
};

export const traverseTreeNodeStatus = ({
  node,
  leafDistance,
  groupDistance,
}: {
  node: MatchingStructureNode;
  leafDistance: number;
  groupDistance: number;
}): NodeStatus => {
  if (!Array.isArray(node)) {
    return {
      id: md5(node.id),
      height: 0,
      leafIds: [node.id],
      size: leafDistance,
      treeWeight: 0.5,
    };
  }
  const children = node.map((node) =>
    traverseTreeNodeStatus({ node, leafDistance, groupDistance }),
  );
  const height = Math.max(...children.map((n) => n.height)) + 1;
  const ss = children.map((n) => n.size);
  const size = ss.reduce((sum, s) => sum + s, 0);
  const rootLinkSize =
    (size +
      ss[0] * children[0].treeWeight -
      ss[ss.length - 1] * (1 - children[ss.length - 1].treeWeight)) /
    2;
  return {
    id: children.reduce((id, n) => md5(`${id}${n.id}`), ''),
    height,
    leafIds: children.reduce<string[]>((arr, n) => [...arr, ...n.leafIds], []),
    size: size + (height === 1 ? groupDistance : 0),
    treeWeight: rootLinkSize / size,
    children,
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
    { nodeStatus: NodeStatus } & React.SVGProps<SVGGElement>
  > = ({ nodeStatus: { height, children, size, treeWeight }, ...other }) => {
    if (!children) {
      return null;
    }
    const accSize = children.reduce<number[]>(
      (arr, n, i) => [...arr, n.size + (i > 0 ? arr[i - 1] : 0)],
      [],
    );
    const groupSizeOffset = height === 1 ? groupDistance / 2 : 0;
    const leavesPos = children.reduce<number[]>(
      (arr, n, i) => [
        ...arr,
        n.size * n.treeWeight + groupSizeOffset + (i > 0 ? accSize[i - 1] : 0),
      ],
      [],
    );
    const rootPos = size * treeWeight;
    return (
      <GroupLayer {...other}>
        {children.map((n, i) => (
          <TreeGroups
            key={n.id}
            nodeStatus={n}
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
