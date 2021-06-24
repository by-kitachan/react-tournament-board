import React from 'react';
import { line as shapeLine } from 'd3-shape';

type Point = { x: number; y: number };
const lineFunction = shapeLine<Point>()
  .x((p) => p.x)
  .y((p) => p.y);

export const Link: React.VFC<{ points: Point[] }> = ({ points }) => {
  const path = lineFunction(points);
  return <path d={path ?? undefined} />;
};
