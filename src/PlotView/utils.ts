import {
  IPlotDatum,
  IPlotDatumDateProps,
  IPlotSettings,
  ISummarizedPlotDatum,
  Trend,
} from './types';

export function extractDate(reading: IPlotDatum): IPlotDatumDateProps | null {
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
}

export function extractData(
  plotSettings: IPlotSettings,
  reading: IPlotDatum,
): ISummarizedPlotDatum {
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
      return 'arrow-up-thick';
    case 2:
    case Trend.SingleUp:
      return 'arrow-up';
    case 3:
    case Trend.FortyFiveUp:
      return 'arrow-top-right';
    case 4:
    case Trend.Flat:
      return 'arrow-right';
    case 5:
    case Trend.FortyFiveDown:
      return 'arrow-bottom-right';
    case 6:
    case Trend.SingleDown:
      return 'arrow-down';
    case 7:
    case Trend.DoubleDown:
      return 'arrow-down-thick';
    default:
      return 'help';
  }
}
