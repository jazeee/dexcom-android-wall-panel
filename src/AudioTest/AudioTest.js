import React from 'react';
import { Button, View } from 'react-native';
import { safePlayAudio } from '../PlotView/playAudio';

export function AudioTest() {
  return (
    <View>
      <Button
        onPress={() => safePlayAudio('eat_please.mp3', 0.2)}
        title="Play"
      />
    </View>
  );
}
