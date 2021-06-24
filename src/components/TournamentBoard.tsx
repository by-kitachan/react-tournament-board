import md5 from 'md5';
import React, { useMemo } from 'react';
import { Direction, MatchingStructure, MatchingStructureNode } from '../types';
import { SVGLayer, GroupLayer } from './chart/layer';
import { Link } from './chart/line';

export interface TournamentBoardProps {
  competitor: MatchingStructure;
  direction?: Direction;
}

const Tree: React.VFC<{
  leavesPos: number[];
  rootPos: number;
  leafLinkLength: number;
  rootLinkLength: number;
  direction: Direction;
}> = ({ leavesPos, rootPos, leafLinkLength, rootLinkLength, direction }) => {
  return (
    <GroupLayer>
      {leavesPos.map((p, i) => (
        <Link
          key={i}
          points={
            direction === 'vertical'
              ? [
                  { x: 0, y: p },
                  { x: leafLinkLength, y: p },
                  { x: leafLinkLength, y: rootPos },
                  { x: leafLinkLength + rootLinkLength, y: rootPos },
                ]
              : [
                  { x: p, y: leafLinkLength + rootLinkLength },
                  { x: p, y: rootLinkLength },
                  { x: rootPos, y: rootLinkLength },
                  { x: rootPos, y: 0 },
                ]
          }
        />
      ))}
    </GroupLayer>
  );
};

export const TournamentBoard: React.VFC<TournamentBoardProps> = ({
  competitor,
  direction = 'vertical',
}) => {
  type NodeStatus = {
    id: string;
    height: number;
    leafNum: number;
    leafIds: string[];
    treeWeight: number;
    children?: NodeStatus[];
  };
  const treeNodeStatus = useMemo(() => {
    const traverse = (node: MatchingStructureNode): NodeStatus => {
      if (!Array.isArray(node)) {
        return {
          id: md5(node.id),
          height: 0,
          leafNum: 1,
          leafIds: [node.id],
          treeWeight: 0.5,
        };
      }
      const children = node.map(traverse);
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
      return {
        id: children.reduce((id, n) => md5(`${id}${n.id}`), ''),
        height: Math.max(...children.map((n) => n.height)) + 1,
        leafNum: totalLeafNum,
        leafIds: children.reduce<string[]>(
          (arr, n) => [...arr, ...n.leafIds],
          [],
        ),
        treeWeight,
        children,
      };
    };
    return traverse(competitor);
  }, [competitor]);

  const linkLength = 100;
  const leafLinkLength = linkLength * 0.7;
  const rootLinkLength = linkLength * 0.3;
  const leafDistance = 30;
  const rootHeight = treeNodeStatus.height;
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
    const leavesStartPos = children.reduce<number[]>(
      (arr, n, i) => [...arr, (accLeafNum[i] - n.leafNum) * leafDistance],
      [],
    );
    const leavesPos = children.reduce<number[]>(
      (arr, n, i) => [
        ...arr,
        (accLeafNum[i] - n.leafNum + n.treeWeight * n.leafNum) * leafDistance,
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
              ? `translate(${linkLength * height} 0)`
              : `translate(0 ${linkLength * (rootHeight - height)})`
          }
        >
          <Tree
            {...{
              leavesPos,
              rootPos,
              leafLinkLength,
              rootLinkLength,
              direction,
            }}
          />
        </GroupLayer>
      </GroupLayer>
    );
  };

  return (
    <div>
      <SVGLayer width={1000} height={1000}>
        <GroupLayer stroke="white" strokeWidth={2} fill="transparent">
          <TreeGroups nodeStatus={treeNodeStatus} />
        </GroupLayer>
      </SVGLayer>
    </div>
  );
};
