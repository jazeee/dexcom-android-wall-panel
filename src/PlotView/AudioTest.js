/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { Button, View } from 'react-native';
import { safePlayAudio } from './playAudio';
import { generateViewContainer } from '../UserSettings/Container';
class AudioTest extends Component {
  componentDidMount() {
    setInterval(() => {
      safePlayAudio('eat_please.mp3', 0.5);
    }, 15000);
  }
  render() {
    return (
      <View>
        <Button
          onPress={() => safePlayAudio('eat_please.mp3', 0.2)}
          title="Play"
        />
      </View>
    );
  }
}

const Container = generateViewContainer({ View: AudioTest });

export default Container;
