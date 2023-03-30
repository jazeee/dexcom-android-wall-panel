import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS } from '../../common/colors';
import { Trend } from '../types';
import { getIconName } from '../utils';

interface Props {
  value: number;
  trend: number | Trend;
  isOldReading: boolean;
  width: number;
  height: number;
}

export function Overlay(props: Props) {
  const { width, height, value, trend, isOldReading } = props;
  const isLarge = width > 480 && height > 360;
  return (
    <ScrollView style={styles.innerContainer}>
      <Text
        style={
          // eslint-disable-next-line react-native/no-inline-styles
          {
            ...styles.value,
            fontSize: 180 - (isLarge ? 0 : 80),
            color: isOldReading ? '#666' : COLORS.primary,
          }
        }>
        {value ? value : '-'}{' '}
        {isOldReading && <Icon name="help" size={isLarge ? 120 : 60} />}
        <Icon name={getIconName(trend)} size={isLarge ? 120 : 60} />
        {(trend === 1 || trend === 7) && (
          <Icon name={getIconName()} size={isLarge ? 120 : 60} />
        )}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {},
  value: {
    fontSize: 180,
    color: COLORS.primary,
  },
});
