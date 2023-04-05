import React from 'react';
import { Button, View } from 'react-native';
import { safePlayAudio } from '../PlotView/playAudio';

export function AudioTest() {
  return (
    <View>
      <Button
        onPress={() => safePlayAudio('eat_please.mp3', 0.2)}
        title="Play Eat Please 0.2"
      />
      <Button
        onPress={() => safePlayAudio('eat_please.mp3', 1.0)}
        title="Play Eat Please 1.0"
      />
      <Button
        onPress={() => safePlayAudio('high_alert.mp3', 0.2)}
        title="Play High Alert 0.2"
      />
      <Button
        onPress={() => safePlayAudio('high_alert.mp3', 1.0)}
        title="Play High Alert 1.0"
      />
    </View>
  );
}
