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
  plotSettings: object,
};

type State = {};

const FUTURE_TIME_IN_SECONDS = 40 * 60;

export default class GlucoseGraph extends Component<Props, State> {
  render() {
    const { width, height, readings, plotSettings } = this.props;
    if (!width || !height || !readings || !readings.length || !plotSettings) {
      return null;
    }
    const {
      minScale, //: 30,
      lowAxis, //: 70,
      highAxis, //: 140,
      higherAxis, //: 160,
      maxScale, //: 250,
      units, // 'mg/dL'
    } = plotSettings;
    const calcTimePosition = value => {
      if (width < 300) {
        // Leave enough space for 20 minutes of future data.
        return width - (value + FUTURE_TIME_IN_SECONDS / 2) / 20;
      }
      // Leave enough space for 40 minutes of future data.
      return width - (value + FUTURE_TIME_IN_SECONDS) / 20;
    };
    const calcValuePosition = value => {
      let heightRatio = 1 - (value - minScale) / (maxScale - minScale);
      heightRatio = Math.max(0, heightRatio);
      heightRatio = Math.min(1, heightRatio);
      return height * heightRatio;
    };
    const readingData = readings.map(extractData.bind(null, plotSettings));
    const [lastReadingDatum] = readingData;
    const { color: lastReadingColor, isInRange } = lastReadingDatum;
    const projectedReadings = projectReadings(readingData, highAxis);
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
          y={calcValuePosition(lowAxis)}
          units={units}
          width={width}
          color="red"
          value={lowAxis}
        />
        <AxisLine
          y={calcValuePosition(highAxis)}
          units={units}
          width={width}
          color="#666"
          value={highAxis}
        />
        <AxisLine
          y={calcValuePosition(higherAxis)}
          units={units}
          width={width}
          color="yellow"
          value={higherAxis}
        />
        {[...readingData, ...projectedReadings].map((datum, index) => {
          const {
            value,
            timeSinceLastReadingInSeconds,
            color,
            isProjected,
            projectedIndex,
            opacity = 1.0,
          } = datum;
          const x = calcTimePosition(timeSinceLastReadingInSeconds);
          const y = calcValuePosition(value);
          const textAnchor = (width - x) / width < 0.1 ? 'end' : 'middle';
          return (
            <React.Fragment key={index}>
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
              {(projectedIndex === 5 || (!isProjected && index % 5 === 0)) && (
                <SvgText
                  x={x}
                  y={y}
                  color={color}
                  textAnchor={textAnchor}
                  opacity={isProjected ? 0.8 : 1.0}
                  yOffset={8}
                  fontSize={16}>
                  {value}
                </SvgText>
              )}
            </React.Fragment>
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
