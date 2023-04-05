import Sound from 'react-native-sound';
import { Audio } from 'expo-av';

Sound.setCategory('Playback');

function getSoundAsset(audioName: string) {
  switch (audioName) {
    case 'eat_please.mp3':
      return require('./assets/eat_please.mp3');
    case 'high_alert.mp3':
      return require('./assets/high_alert.mp3');
    default:
      throw new Error(`Unknown audio asset ${audioName}`);
  }
}

function createSoundPlayer(audioName: string) {
  return Audio.Sound.createAsync(getSoundAsset(audioName));
}

let playCount = 0;
export async function playAudio(audioName: string, volume = 1.0) {
  const soundPlayer = createSoundPlayer(audioName);
  const { sound } = await soundPlayer;
  console.log(`Played sound ${++playCount} times at volume ${volume}`);
  await sound.setVolumeAsync(volume);
  // await sound.setPositionAsync(0);
  return await sound.playAsync();
}

export function safePlayAudio(audioName: string, volume = 1.0) {
  console.log(`Playing ${audioName}`);
  playAudio(audioName, volume)
    .then((result) => console.log(`Successfully played ${audioName}`, result))
    .catch((error) => console.debug(`Failed to play ${audioName}`, error));
}

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

const LOW_VOLUME = 0.2;
export function playAudioIfNeeded(value: number, meta: any) {
  if (value <= meta.lowAxis && shouldAlarm('lowAxis')) {
    safePlayAudio('eat_please.mp3', LOW_VOLUME);
  }
  if (value <= meta.lowWarning && shouldAlarm('lowWarning')) {
    safePlayAudio('eat_please.mp3');
  }
  if (value >= meta.higherAxis && shouldAlarm('higherAxis')) {
    safePlayAudio('high_alert.mp3', LOW_VOLUME);
  }
  if (value >= meta.highWarning && shouldAlarm('highWarning')) {
    safePlayAudio('high_alert.mp3');
  }
}
