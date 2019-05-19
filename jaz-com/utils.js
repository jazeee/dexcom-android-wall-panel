export const extractDate = (reading) => {
  const { ST: serverTimeString } = reading;
  const matches = /Date\(([0-9]*)\)/.exec(serverTimeString);
  if (matches) {
    const timeInMilliseconds = Number(matches[1]);
    const timeInSeconds = timeInMilliseconds / 1000;
    const timeSinceLastReadingInSeconds = (Date.now() / 1000) - timeInSeconds;
    const isOldReading = timeSinceLastReadingInSeconds > 10 * 60 * 1000;
    return {
      timeInMilliseconds,
      timeInSeconds,
      timeSinceLastReadingInSeconds,
      isOldReading,
      date: new Date(timeInMilliseconds),
    };
  }
  return null;
}
