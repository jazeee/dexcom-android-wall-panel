export const playAudio = (audioName: string) => {
  return new Promise((resolve, reject) => {
    resolve(true);
  });
};

export const safePlayAudio = (audioName: string) => {
  console.log(`Playing ${audioName}`);
  playAudio(audioName)
    .then(result => console.log(`Successfully played ${audioName}`, result))
    .catch(error => console.debug(`Failed to play ${audioName}`, error));
};
