export const extractDate = reading => {
  const { ST: serverTimeString } = reading;
  const matches = /Date\(([0-9]*)\)/.exec(serverTimeString);
  if (matches) {
    const timeInMilliseconds = Number(matches[1]);
    const timeInSeconds = timeInMilliseconds / 1000;
    const timeSinceLastReadingInSeconds = Date.now() / 1000 - timeInSeconds;
    const timeSinceLastReadingInMinutes = timeSinceLastReadingInSeconds / 60;
    const isOldReading = timeSinceLastReadingInSeconds > 10 * 60;
    return {
      timeInMilliseconds,
      timeInSeconds,
      timeSinceLastReadingInSeconds,
      timeSinceLastReadingInMinutes,
      isOldReading,
      date: new Date(timeInMilliseconds),
    };
  }
  return null;
};

export const extractData = reading => {
  const dateDetails = extractDate(reading) || {};
  const { Trend: trend, Value: value } = reading;
  const isHigh = value >= 160;
  const isLow = value < 70;
  const color = isHigh ? 'orange' : isLow ? 'red' : 'green';
  return {
    ...dateDetails,
    value,
    trend,
    color,
    isHigh,
    isLow,
    isInRange: !isHigh && !isLow,
  };
};
