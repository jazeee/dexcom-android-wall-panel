import React, { ReactNode } from 'react';
import { Text, TextProps } from 'react-native-svg';

interface Props extends TextProps {
  x: number;
  y: number;
  yOffset?: number;
  color: string;
  children: ReactNode;
}

export function SvgText(props: Props) {
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
}
