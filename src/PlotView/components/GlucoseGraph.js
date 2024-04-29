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
  Text,
} from 'react-native-svg';
import AxisLine from './AxisLine';
import SvgText from './SvgText';
import { extractData } from "../utils";

type Props = {
  readings: PropTypes.array,
  width: 0,
  height: 0,
};

type State = {
}

const MIN_Y_VALUE = 30;
const MAX_Y_VALUE = 250;

export default class GlucoseGraph extends Component<Props, State> {
  render() {
    const {
      width,
      height,
      readings,
    } = this.props;
    if (!width || !height || !readings || !readings.length) {
      return null;
    }
    const calcTimePosition = (value) => {
      return width - (value / 20);
    }
    const calcValuePosition = (value) => {
      let heightRatio = 1 - ((value - MIN_Y_VALUE)/(MAX_Y_VALUE - MIN_Y_VALUE));
      heightRatio = Math.max(0, heightRatio);
      heightRatio = Math.min(1, heightRatio);
      return height * heightRatio;
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
        <AxisLine
          y={calcValuePosition(70)}
          width={width}
          color="yellow"
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
          color="red"
          value={160}
        />
        {readings.map((reading, index) => {
          const {
            value,
            timeSinceLastReadingInSeconds,
            color,
          } = extractData(reading);
          const x = calcTimePosition(timeSinceLastReadingInSeconds);
          const y = calcValuePosition(value);
          return (
            <>
              <Circle
                key={index}
                cx={x}
                cy={y}
                r="5"
                stroke="white"
                strokeWidth="1.5"
                fill={color}
              />
              { index % 10 === 0 &&
                <SvgText
                  x={x}
                  y={y}
                  color={color}
                  textAnchor={((width - x) / width) < 0.1 ? "end" : "middle"}
                  opacity={1}
                  yOffset={8}
                  fontSize={16}
                >
                  {value}
                </SvgText>
              }
            </>
          );
        })}
      </Svg>
    );
  }
}

const styles = StyleSheet.create({
});
