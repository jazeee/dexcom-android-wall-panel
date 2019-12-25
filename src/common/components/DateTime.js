/**
 * @format
 * @flow
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';

import { COLORS } from '../colors';

type Props = {
  style?: object,
};

export default function DateTime(props: Props) {
  const [dateTime, setDateTime] = useState('');
  const timerRef = useRef(-1);

  const updateTime = useCallback(() => {
    setDateTime(new Date().toLocaleTimeString());
    timerRef.current = setTimeout(() => {
      updateTime();
    }, 1000);
  }, []);

  useEffect(() => {
    updateTime();
    return () => {
      if (timerRef.current >= 0) {
        clearTimeout(timerRef.current);
      }
    };
  }, [updateTime, timerRef]);

  const { style = {} } = props;
  return (
    <Text
      style={{
        ...styles.dateTime,
        ...style,
      }}>
      {dateTime}
    </Text>
  );
}

const styles = StyleSheet.create({
  dateTime: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: COLORS.primary,
  },
});
