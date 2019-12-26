import regression from 'regression';

const READING_COUNT = 10;
const PROJECTED_COUNT = 10;
export const projectReadings = readingData => {
  const lastReadings = readingData.slice(0, READING_COUNT);
  const arrayPairs = lastReadings.map(
    ({ value, timeSinceLastReadingInSeconds }) => [
      timeSinceLastReadingInSeconds,
      value,
    ],
  );
  if (arrayPairs.length <= 3) {
    return [];
  }
  const [firstPair] = arrayPairs;
  const [lastPair] = arrayPairs.slice(-1);
  if (lastPair[0] - firstPair[0] > READING_COUNT * 2 * 5 * 60) {
    return [];
  }

  const { equation: coefficients } = regression.polynomial(arrayPairs, {
    order: 2,
    precision: 8,
  });
  const [acceleration, slope] = coefficients;
  // const acceleration = 0;
  const [latestDatum] = readingData;
  const {
    value: latestValue,
    timeSinceLastReadingInSeconds: latestTimeInSeconds,
  } = latestDatum;
  const projectedReadings = [];

  for (let index = 0; index < PROJECTED_COUNT; index += 1) {
    const deltaInSec = -(index + 1) * 5 * 60;
    const timeSinceLastReadingInSeconds = latestTimeInSeconds + deltaInSec;
    const value = Math.round(
      latestValue + slope * deltaInSec + acceleration * deltaInSec ** 2,
    );
    projectedReadings.push({
      ...latestDatum,
      value,
      color: '#666',
      opacity: 0.4 * (1 - index / (PROJECTED_COUNT + 4)),
      timeSinceLastReadingInSeconds,
      timeSinceLastReadingInMinutes: timeSinceLastReadingInSeconds / 60,
      isProjected: true,
      index,
    });
  }
  return projectedReadings;
};
