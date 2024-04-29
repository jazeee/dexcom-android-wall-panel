import Sound from 'react-native-sound';

export const playAudio = (audioName: string) => {
  return new Promise((resolve, reject) => {
    const sound = new Sound(audioName, null, error => {
      if (error) {
        return reject(error);
      }
      sound.play(resolve);
    });
  });
};

export const safePlayAudio = (audioName: string) => {
  console.log(`Playing ${audioName}`);
  playAudio(audioName)
    .then(result => console.log(`Successfully played ${audioName}`, result))
    .catch(error => console.debug(`Failed to play ${audioName}`, error));
};
