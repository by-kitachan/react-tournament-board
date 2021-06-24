import React from 'react';

export const SVGLayer: React.FC<React.SVGProps<SVGSVGElement>> = ({
  children,
  ...other
}) => {
  return <svg {...other}>{children}</svg>;
};

export const GroupLayer: React.FC<React.SVGProps<SVGGElement>> = ({
  children,
  ...other
}) => {
  return <g {...other}>{children}</g>;
};
