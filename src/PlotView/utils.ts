import { IPlotDatum, IPlotDatumDateProps, IPlotSettings, ISummarizedPlotDatum, Trend } from './types';

export function extractDate(reading: IPlotDatum | undefined): IPlotDatumDateProps | null {
  if (!reading) {
    return null;
  }
  const { ST: serverTimeString } = reading;
  const matches = /Date\(([0-9]*)\)/.exec(serverTimeString);
  if (matches) {
    const timeInMilliseconds = Number(matches[1]);
    const timeInSeconds = timeInMilliseconds / 1000;
    const timeSinceLastReadingInSeconds = Date.now() / 1000 - timeInSeconds;
    const timeSinceLastReadingInMinutes = timeSinceLastReadingInSeconds / 60;
    const readingIsOld = timeSinceLastReadingInSeconds > 10 * 60;
    return {
      timeInMilliseconds,
      timeInSeconds,
      timeSinceLastReadingInSeconds,
      timeSinceLastReadingInMinutes,
      readingIsOld,
      date: new Date(timeInMilliseconds),
    };
  }
  return null;
}

export function extractData(plotSettings: IPlotSettings, reading: IPlotDatum): ISummarizedPlotDatum {
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
}

export function getIconName(trend?: Trend | number) {
  // https://reactnativeelements.com/docs/components/icon
  switch (trend) {
    case 1:
    case Trend.DoubleUp:
      return 'keyboard-double-arrow-up';
    case 2:
    case Trend.SingleUp:
      return 'arrow-upward';
    case 3:
    case Trend.FortyFiveUp:
      return 'trending-up';
    case 4:
    case Trend.Flat:
      return 'arrow-forward';
    case 5:
    case Trend.FortyFiveDown:
      return 'trending-down';
    case 6:
    case Trend.SingleDown:
      return 'arrow-downward';
    case 7:
    case Trend.DoubleDown:
      return 'keyboard-double-arrow-down';
    default:
      return 'question-mark';
  }
}

export function updateTestReadingDateTimes(readings: IPlotDatum[]) {
  const [latestReading] = readings;
  const latestReadingDate = extractDate(latestReading);
  readings.forEach((reading: IPlotDatum) => {
    const readingDate = extractDate(reading);
    const updatedTimeInMilliseconds =
      Date.now() + (readingDate?.timeInMilliseconds ?? 0) - (latestReadingDate?.timeInMilliseconds ?? 0);
    reading.ST = `/Date(${updatedTimeInMilliseconds})/`;
  });
}
