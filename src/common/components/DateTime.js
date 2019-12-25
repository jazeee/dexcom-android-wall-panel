/**
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { COLORS } from '../colors';

type Props = {
  style?: object,
};

type State = {
  dateTime: string,
}

// Apparently, React hooks break on KitKat...
export default class DateTime extends React.Component<Props, State> {
  state = {
    dateTime: 'Loading...',
  }
  timerRef = undefined;

  componentDidMount() {
    this.updateTime();
  }

  componentWillUnmount() {
    if (this.timerRef != null) {
      clearTimeout(this.timerRef);
      this.timerRef = undefined;
    }
  }

  updateTime = () => {
    this.setState({ dateTime: new Date().toLocaleTimeString() });
    this.timerRef = setTimeout(() => {
      this.updateTime();
    }, 1000);
  }

  render() {
    const { dateTime } = this.state;
    const { style = {} } = this.props;
    return (
      <Text
        style={{
          ...styles.dateTime,
          ...style,
        }}
      >
        {dateTime}
      </Text>
    );
  }
}

const styles = StyleSheet.create({
  dateTime: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: COLORS.primary,
  },
});
