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

export const extractData = (plotSettings, reading) => {
  const { higherAxis, lowAxis } = plotSettings;
  const dateDetails = extractDate(reading) || {};
  const { Trend: trend, Value: value } = reading;
  const isHigh = value >= higherAxis;
  const isLow = value < lowAxis;
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

export const getIconName = trend => {
  // https://materialdesignicons.com/
  switch (trend) {
    case 1:
      return 'arrow-up-thick';
    case 2:
      return 'arrow-up';
    case 3:
      return 'arrow-top-right';
    case 4:
      return 'arrow-right';
    case 5:
      return 'arrow-bottom-right';
    case 6:
      return 'arrow-down';
    case 7:
      return 'arrow-down-thick';
    default:
      return 'question';
  }
};
