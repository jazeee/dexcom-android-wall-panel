// import Sound from 'react-native-sound';

import { useCallback } from 'react';
import { AudioSample, useAudioSample } from '../Audio/useAudioSample';

const lastAlarmTimes: Record<string, number> = {};
function shouldAlarm(type: string) {
  const currentTime = Date.now();
  const lastAlarmTime = lastAlarmTimes[type] || 0;
  if (currentTime - lastAlarmTime >= 30 * 60 * 1000) {
    lastAlarmTimes[type] = currentTime;
    return true;
  }
  return false;
}

export function usePlayAudioIfNeeded() {
  const { playSample } = useAudioSample();

  const playAudioIfNeeded = useCallback(
    (value: number, meta: any) => {
      if (value <= meta.lowAxis && shouldAlarm('lowAxis')) {
        playSample(AudioSample.EatPleaseQuieter);
      }
      if (value <= meta.lowWarning && shouldAlarm('lowWarning')) {
        playSample(AudioSample.EatPlease);
      }
      if (value >= meta.higherAxis && shouldAlarm('higherAxis')) {
        playSample(AudioSample.HighAlertQuieter);
      }
      if (value >= meta.highWarning && shouldAlarm('highWarning')) {
        playSample(AudioSample.HighAlert);
      }
    },
    [playSample],
  );
  return { playAudioIfNeeded };
}
