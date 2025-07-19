import React from 'react';
import { Button, View } from 'react-native';
import { AudioSample, useAudioSample } from '../Audio/useAudioSample';

export function AudioTest() {
  const { playSample } = useAudioSample();
  return (
    <View>
      <Button
        onPress={() => playSample(AudioSample.EatPleaseQuieter)}
        title="Play Eat Please Quieter"
      />
      <Button
        onPress={() => playSample(AudioSample.EatPlease)}
        title="Play Eat Please"
      />
      <Button
        onPress={() => playSample(AudioSample.HighAlertQuieter)}
        title="Play High Alert Quieter"
      />
      <Button
        onPress={() => playSample(AudioSample.HighAlert)}
        title="Play High Alert"
      />
    </View>
  );
}
