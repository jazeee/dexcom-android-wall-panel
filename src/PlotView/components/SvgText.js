import React from 'react';
import { Text } from 'react-native-svg';

type Props = {
  x: number,
  y: number,
  yOffset?: number,
  color: string,
  children: string,
};

const SvgText = (props: Props) => {
  const { x, y, yOffset = 4, children, color, ...otherProps } = props;
  return (
    <Text
      fill={color}
      stroke="none"
      fontSize="12"
      x={x}
      y={y - yOffset}
      textAnchor="start"
      opacity={0.5}
      {...otherProps}>
      {children}
    </Text>
  );
};

export default SvgText;
