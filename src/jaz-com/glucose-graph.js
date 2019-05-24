/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {
  StyleSheet,
} from 'react-native';
import Svg, {
  Circle,
  Rect,
  Line,
} from 'react-native-svg';
import { extractData } from "./utils";

type Props = {
  readings: PropTypes.array,
  width: 0,
  height: 0,
};

type State = {
}

export class GlucoseGraph extends Component<Props, State> {
  render() {
    const {
      width,
      height,
      readings,
    } = this.props;
    if (!width || !height || !readings || !readings.length) {
      return null;
    }
    const calcValuePosition = (value) => {
      return height - (height * value/250);
    }
    const [lastReading] = readings;
    const lastData = extractData(lastReading);
    const {color, isInRange} = lastData;
    return (
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Rect
          x={0}
          y={0}
          width={width}
          height={height}
          stroke={color}
          strokeWidth={isInRange ? 1 : 6}
          fill="none"
          opacity={isInRange ? 0.2 : 0.5}
        />
        <Line
          x1={0}
          x2={width}
          y1={calcValuePosition(70)}
          y2={calcValuePosition(70)}
          stroke="yellow"
          strokeWidth={1}
          opacity={0.5}
        />
        <Line
          x1={0}
          x2={width}
          y1={calcValuePosition(160)}
          y2={calcValuePosition(160)}
          stroke="red"
          strokeWidth={1}
          opacity={0.5}
        />
        {readings.map((reading, index) => {
          const {
            value,
            timeSinceLastReadingInSeconds,
            color,
          } = extractData(reading);
          return (
            <Circle
              key={index}
              cx={width - (timeSinceLastReadingInSeconds / 20)}
              cy={calcValuePosition(value)}
              r="5"
              stroke="white"
              strokeWidth="1.5"
              fill={color}
            />
          );
        })}
      </Svg>
    );
  }
}

const styles = StyleSheet.create({
});
