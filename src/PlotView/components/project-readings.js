const calculateSlopeInValuePerSec = (datum2, datum1) => {
  const { value: value1, timeSinceLastReadingInSeconds: timeInSec1 } = datum1;
  const { value: value2, timeSinceLastReadingInSeconds: timeInSec2 } = datum2;
  return (value2 - value1) / Math.min(1, timeInSec2 - timeInSec1);
};

export const projectReadings = readingData => {
  const projectedReadings = [];
  if (readingData.length >= 3) {
    let slope;
    for (let i = Math.min(5, readingData.length - 1); i >= 0; --i) {
      const current = readingData[i];
      const prior = readingData[i + 1];
      const lastSlope = calculateSlopeInValuePerSec(current, prior);
      if (slope != null) {
        // Weigh latest readings more than prior readings.
        slope = 0.4 * slope + 0.6 * lastSlope;
      } else {
        slope = lastSlope;
      }
    }
    const [latestDatum] = readingData;
    const {
      value: latestValue,
      timeSinceLastReadingInSeconds: latestTimeInSeconds,
    } = latestDatum;
    for (let i = 1; i < 10; i += 1) {
      const deltaTimeInSec = -i * 5 * 60;
      const timeSinceLastReadingInSeconds =
        latestTimeInSeconds + deltaTimeInSec;
      projectedReadings.push({
        ...latestDatum,
        value: Math.round(latestValue + slope * deltaTimeInSec),
        color: '#666',
        timeSinceLastReadingInSeconds,
        timeSinceLastReadingInMinutes: timeSinceLastReadingInSeconds / 60,
        isProjected: true,
      });
    }
  }
  return projectedReadings;
};
