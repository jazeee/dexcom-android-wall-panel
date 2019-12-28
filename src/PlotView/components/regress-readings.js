import regression from 'regression';

const READING_COUNT = 10;
const PROJECTED_COUNT = 10;
export const projectReadings = readingData => {
  const lastReadings = readingData.slice(0, READING_COUNT);
  const weightedLastReadings = [];
  // Weigh newest readings more
  for (let i = 0; i < lastReadings.length; i += 1) {
    for (let j = 0; j < READING_COUNT - i; j += 1) {
      weightedLastReadings.push(lastReadings[i]);
    }
  }
  const arrayPairs = weightedLastReadings.map(
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

  const { equation: coefficients, r2: rSquared } = regression.polynomial(
    arrayPairs,
    {
      order: 2,
      precision: 8,
    },
  );
  if (rSquared < 0.8) {
    // Scan for anomalies - do not provide projected data if there are odd steps.
    console.debug(`Not projecting data due to low rSquared: ${rSquared}`);
    return [];
  }
  const [acceleration, slope] = coefficients;
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
      opacity: 0.6 * (1 - index / (PROJECTED_COUNT - 2)),
      timeSinceLastReadingInSeconds,
      timeSinceLastReadingInMinutes: timeSinceLastReadingInSeconds / 60,
      isProjected: true,
      projectedIndex: index,
    });
  }
  return projectedReadings;
};
