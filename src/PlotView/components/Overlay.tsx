import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS } from '../../common/colors';
import { Trend } from '../types';
import { getIconName } from '../utils';

interface Props {
  value: number;
  trend: number | Trend;
  readingIsOld: boolean;
  width: number;
  height: number;
}

export function Overlay(props: Props) {
  const { width, height, value, trend, readingIsOld } = props;
  const widthIsLarge = width > 480 && height > 360;
  const iconSize = widthIsLarge ? 120 : 60;
  return (
    <ScrollView style={styles.innerContainer}>
      <Text
        style={
          // eslint-disable-next-line react-native/no-inline-styles
          {
            ...styles.value,
            fontSize: 180 - (widthIsLarge ? 0 : 80),
            color: readingIsOld ? '#666' : COLORS.primary,
          }
        }>
        {value ? value : '-'}{' '}
        {readingIsOld && <Icon name="help" size={iconSize} />}
        <Icon name={getIconName(trend)} size={iconSize} />
        {(trend === 1 || trend === 7) && (
          <Icon name={getIconName()} size={iconSize} />
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
    textShadowColor: '#3af',
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    textShadowRadius: 8,
  },
});
