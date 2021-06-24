import md5 from 'md5';
import React from 'react';
import { Direction, MatchingStructureNode } from '../../types';
import { TournamentBoardProps } from '../TournamentBoard';
import { GroupLayer } from './layer';
import { Link } from './line';

export type NodeStatus = {
  id: string;
  height: number;
  groupNum: number;
  leafNum: number;
  leafIds: string[];
  treeWeight: number;
  children?: NodeStatus[];
};

export const traverseTreeNodeStatus = (
  node: MatchingStructureNode,
): NodeStatus => {
  if (!Array.isArray(node)) {
    return {
      id: md5(node.id),
      height: 0,
      groupNum: 0,
      leafNum: 1,
      leafIds: [node.id],
      treeWeight: 0.5,
    };
  }
  const children = node.map(traverseTreeNodeStatus);
  const totalLeafNum = children.reduce((sum, n) => sum + n.leafNum, 0);
  let treeWeight = 0;
  if (children.length >= 2) {
    for (let i = 0; i < children.length; i++) {
      treeWeight +=
        (children[i].leafNum / totalLeafNum) * (i / (children.length - 1));
    }
  } else {
    treeWeight = 0.5;
  }
  const height = Math.max(...children.map((n) => n.height)) + 1;
  return {
    id: children.reduce((id, n) => md5(`${id}${n.id}`), ''),
    height,
    groupNum:
      children.reduce((sum, n) => sum + n.groupNum, 0) + (height === 1 ? 1 : 0),
    leafNum: totalLeafNum,
    leafIds: children.reduce<string[]>((arr, n) => [...arr, ...n.leafIds], []),
    treeWeight,
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
  > = ({ nodeStatus: { height, children }, ...other }) => {
    if (!children) {
      return null;
    }
    const accLeafNum = children.reduce<number[]>(
      (arr, n, i) => [...arr, n.leafNum + (i > 0 ? arr[i - 1] : 0)],
      [],
    );
    const accGroupNum = children.reduce<number[]>(
      (arr, n, i) => [...arr, n.groupNum + (i > 0 ? arr[i - 1] : 0)],
      [],
    );
    const leavesStartPos = children.reduce<number[]>(
      (arr, n, i) => [
        ...arr,
        (accLeafNum[i] - n.leafNum) * leafDistance +
          (accGroupNum[i] - n.groupNum) * groupDistance,
      ],
      [],
    );
    const leavesPos = children.reduce<number[]>(
      (arr, n, i) => [
        ...arr,
        (accLeafNum[i] - n.leafNum + n.treeWeight * n.leafNum) * leafDistance +
          (accGroupNum[i] -
            n.groupNum +
            Math.max(n.groupNum - 1, 0) * n.treeWeight) *
            groupDistance,
      ],
      [],
    );
    const rootPos = leavesPos.reduce((sum, n) => sum + n, 0) / leavesPos.length;
    return (
      <GroupLayer {...other}>
        {children.map((n, i) => (
          <TreeGroups
            key={n.id}
            nodeStatus={n}
            transform={
              direction === 'vertical'
                ? `translate(0 ${leavesStartPos[i]})`
                : `translate(${leavesStartPos[i]} 0)`
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
  return (
    <TreeGroups
      transform={
        direction === 'vertical'
          ? `translate(0 ${groupDistance / 2})`
          : `translate(${groupDistance / 2} 0)`
      }
      nodeStatus={treeNodeStatus}
    />
  );
};
