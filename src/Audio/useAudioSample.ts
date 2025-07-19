import { useAudioPlayer } from 'expo-audio';
import { useCallback } from 'react';

const eatPleaseSource = require('./assets/eatPlease.mp3');
const eatPleaseQuieterSource = require('./assets/eatPleaseQuieter.mp3');
const highAlertSource = require('./assets/highAlert.mp3');
const highAlertQuieterSource = require('./assets/highAlertQuieter.mp3');

export enum AudioSample {
  EatPlease = 'EatPlease',
  EatPleaseQuieter = 'EatPleaseQuieter',
  HighAlert = 'HighAlert',
  HighAlertQuieter = 'HighAlertQuieter',
}

const SourcesByAudioSample: Record<AudioSample, string> = {
  [AudioSample.EatPlease]: eatPleaseSource,
  [AudioSample.EatPleaseQuieter]: eatPleaseQuieterSource,
  [AudioSample.HighAlert]: highAlertSource,
  [AudioSample.HighAlertQuieter]: highAlertQuieterSource,
};

export function useAudioSample() {
  const player = useAudioPlayer();

  const playSample = useCallback(
    (audioSample: AudioSample) => {
      player.replace(SourcesByAudioSample[audioSample]);
      player.seekTo(0);
      player.play();
    },
    [player],
  );

  return {
    playSample,
  };
}
