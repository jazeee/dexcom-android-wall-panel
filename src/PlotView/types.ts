export enum Trend {
  DoubleDown = 'DoubleDown',
  SingleDown = 'SingleDown',
  FortyFiveDown = 'FortyFiveDown',
  Flat = 'Flat',
  FortyFiveUp = 'FortyFiveUp',
  SingleUp = 'SingleUp',
  DoubleUp = 'DoubleUp',
}

export interface IPlotDatum {
  DT: string; // "\/Date(1426780716000-0700)\/",
  ST: string; // "\/Date(1426784306000)\/",
  Trend: Trend;
  Value: number; // 99
  WT: string; //"\/Date(1426769941000)\/"
}

export interface IPlotDatumDateProps {
  timeInMilliseconds?: number;
  timeInSeconds?: number;
  timeSinceLastReadingInSeconds?: number;
  timeSinceLastReadingInMinutes?: number;
  readingIsOld?: boolean;
  date?: Date;
}

export interface ISummarizedPlotDatum extends IPlotDatumDateProps {
  value: number;
  trend: Trend;
  isHigh: boolean;
  isLow: boolean;
  isInRange: boolean;
  color: string;
  opacity?: number;
  isProjected?: boolean;
  projectedIndex?: number;
}

export interface IPlotSettings {
  minScale: number;
  maxScale: number;
  lowWarning: number;
  highWarning: number;
  lowAxis: number;
  highAxis: number;
  higherAxis: number;
  units: string;
}

/**
 * Example: https://jazcom.jazeee.com/dx/urls.json
 */
export interface IApiUrl {
  auth: {
    url: string;
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    bodyBase: Record<string, string> | null;
  };
  data: {
    url: string;
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    bodyBase: Record<string, string> | null;
  };
  meta: IPlotSettings | undefined;
}
