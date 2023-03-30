import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const soundPlayers: Record<string, Promise<Sound>> = {};

function createSoundPlayer(audioName: string): Promise<Sound> {
  return new Promise((resolve, reject) => {
    const newSound = new Sound(audioName, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        return reject(error);
      }
    });
    resolve(newSound);
  });
}
['eat_please.mp3', 'high_alert.mp3'].forEach((audioName) => {
  soundPlayers[audioName] = createSoundPlayer(audioName);
});

let playCount = 0;
export async function playAudio(audioName: string, volume = 1.0) {
  let soundPlayer = soundPlayers[audioName];
  if (!soundPlayer) {
    soundPlayer = createSoundPlayer(audioName);
  }
  soundPlayers[audioName] = soundPlayer;
  const player = await soundPlayer;
  return await new Promise((resolve) => {
    console.log(`Played sound ${++playCount} times`);
    player.setVolume(volume).play(resolve);
  });
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
