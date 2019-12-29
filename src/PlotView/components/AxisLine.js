import React from 'react';
import { Line } from 'react-native-svg';
import SvgText from './SvgText';

type Props = {
  y: number,
  units: string,
  width: number,
  color: string,
  value: string,
};

const AxisLine = (props: Props) => {
  const { y, width, value, units, color } = props;
  return (
    <>
      <Line
        x1={0}
        x2={width}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={1}
        opacity={0.5}
      />
      <SvgText x={0} y={y} color={color}>
        {value} {units}
      </SvgText>
    </>
  );
};

export default AxisLine;
