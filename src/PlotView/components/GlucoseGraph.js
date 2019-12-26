/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';
import AxisLine from './AxisLine';
import VertAxisLine from './VertAxisLine';
import SvgText from './SvgText';
import { extractData } from '../utils';
import { projectReadings } from './regress-readings';
import { format, subMinutes } from 'date-fns';

type Props = {
  readings: PropTypes.array,
  width: 0,
  height: 0,
};

type State = {};

const MIN_Y_VALUE = 30;
const MAX_Y_VALUE = 250;

export default class GlucoseGraph extends Component<Props, State> {
  render() {
    const { width, height, readings } = this.props;
    if (!width || !height || !readings || !readings.length) {
      return null;
    }
    const calcTimePosition = value => {
      return width * 0.8 - value / 20;
    };
    const calcValuePosition = value => {
      let heightRatio = 1 - (value - MIN_Y_VALUE) / (MAX_Y_VALUE - MIN_Y_VALUE);
      heightRatio = Math.max(0, heightRatio);
      heightRatio = Math.min(1, heightRatio);
      return height * heightRatio;
    };
    const readingData = readings.map(extractData);
    const [lastReadingDatum] = readingData;
    const { color: lastReadingColor, isInRange } = lastReadingDatum;
    const projectedReadings = projectReadings(readingData);
    const dateAxisValues = [];
    const now = Date.now();
    for (let i = 0; i <= 5 * 60; i += 60) {
      dateAxisValues.push({
        x: calcTimePosition(i * 60),
        value: format(subMinutes(now, i), 'hh:mm a'),
      });
    }
    return (
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={lastReadingColor}
          strokeWidth={isInRange ? 1 : 6}
          fill="none"
          opacity={isInRange ? 0.2 : 0.5}
        />
        <AxisLine
          y={calcValuePosition(70)}
          width={width}
          color="red"
          value={70}
        />
        <AxisLine
          y={calcValuePosition(140)}
          width={width}
          color="#666"
          value={140}
        />
        <AxisLine
          y={calcValuePosition(160)}
          width={width}
          color="yellow"
          value={160}
        />
        {[...readingData, ...projectedReadings].map((datum, index) => {
          const {
            value,
            timeSinceLastReadingInSeconds,
            color,
            isProjected,
            opacity = 1.0,
          } = datum;
          const x = calcTimePosition(timeSinceLastReadingInSeconds);
          const y = calcValuePosition(value);
          const textAnchor = (width - x) / width < 0.1 ? 'end' : 'middle';
          return (
            <>
              <Circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                stroke={isProjected ? color : 'white'}
                strokeWidth="1.5"
                fill={color}
                opacity={opacity}
              />
              {!isProjected && index % 5 === 0 && (
                <SvgText
                  x={x}
                  y={y}
                  color={color}
                  textAnchor={textAnchor}
                  opacity={1}
                  yOffset={8}
                  fontSize={16}>
                  {value}
                </SvgText>
              )}
            </>
          );
        })}
        {dateAxisValues.map(axis => {
          const { x, value } = axis;
          return (
            <VertAxisLine
              key={x}
              x={x}
              height={height}
              color="#666"
              value={value}
            />
          );
        })}
      </Svg>
    );
  }
}
