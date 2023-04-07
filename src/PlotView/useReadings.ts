import { extractDate, updateTestReadingDateTimes } from './utils';
import { DEFAULT_META } from './constants';
import { playAudioIfNeeded } from './playAudio';
import { isTestApi } from '../UserSettings/utils';
import { useSettingsContext } from '../UserSettings/SettingsProvider';
import { IApiUrl, IPlotDatum } from './types';
import { useQuery } from '@tanstack/react-query';

const EXTRA_LATENCY_IN_SECONDS = 10 + 10 * Math.random();

export function useReadings() {
  const { settings } = useSettingsContext();
  const { sourceUrl } = settings;
  const apiIsTestUrl = isTestApi(sourceUrl);
  const {
    data: apiUrls,
    isLoading: apiUrlsAreLoading,
    error: apiUrlsError,
  } = useQuery<IApiUrl, Error, IApiUrl, string[]>({
    queryKey: [sourceUrl, 'urls.json'],
    enabled: Boolean(sourceUrl),
    queryFn: async () => {
      console.log(`Requesting from ${sourceUrl}`);
      const response = await fetch(`${sourceUrl}/urls.json`);
      const { status, ok } = response;
      if (!ok) {
        const apiError = await response.text();
        throw new Error(`${status}: ${apiError}`);
      }
      const retrievedApiUrls: IApiUrl = await response.json();
      if (!retrievedApiUrls) {
        throw new Error('No URL JSON content');
      }
      console.debug('Got API Urls', retrievedApiUrls);
      return retrievedApiUrls;
    },
  });
  const {
    auth: authReq,
    data: dataReq,
    meta: plotSettings = DEFAULT_META,
  } = apiUrls ?? {};
  const { method = 'POST', url: authUrl } = authReq ?? {};
  const { data: authKey, isLoading: authKeyIsLoading } = useQuery({
    enabled: Boolean(authUrl),
    queryKey: [authUrl, settings],
    refetchInterval: 45 * 60 * 1000,
    queryFn: async () => {
      if (!authReq || !authUrl) {
        throw new Error('Unexpected - authReq or authUrl are not set');
      }
      const { username, password } = settings;
      if (!apiIsTestUrl) {
        if (!username || !password) {
          throw new Error('Unexpected - username or password are not set');
        }
      }
      const apiResult = await fetch(authUrl, {
        method,
        mode: 'cors',
        headers: authReq.headers,
        body:
          method !== 'GET'
            ? JSON.stringify({
                ...authReq.bodyBase,
                accountName: username,
                password,
              })
            : undefined,
      });
      const { status, ok } = apiResult;
      if (!ok) {
        throw new Error(`${status}: Unable to ${method} Username`);
      }
      // The response is a string encoded as json, with the surrounding quotes
      const apiText: string = await apiResult.json();
      console.debug('Got API auth', apiText.substring(0, 8));
      return apiText;
    },
  });

  const dataUrl = dataReq?.url;
  const {
    data: readings,
    isLoading: readingsAreLoading,
    error: readingsError,
  } = useQuery<IPlotDatum[], Error, IPlotDatum[], string[]>({
    enabled: Boolean(dataUrl) && Boolean(authKey),
    queryKey: ['readingDataApi', dataUrl ?? '', authKey ?? ''],
    refetchInterval: (data) => {
      let delayToNextRequestInSeconds = 5 * 60;
      if (data) {
        const [latestReading] = data;
        if (latestReading) {
          const { timeSinceLastReadingInSeconds } =
            extractDate(latestReading) || {};
          delayToNextRequestInSeconds -= timeSinceLastReadingInSeconds ?? 0;
          delayToNextRequestInSeconds = Math.max(
            // Ensure the next delay is at least 2 minutes.
            2 * 60,
            delayToNextRequestInSeconds,
          );
          delayToNextRequestInSeconds += EXTRA_LATENCY_IN_SECONDS;
          if (apiIsTestUrl) {
            delayToNextRequestInSeconds = 4 * 60 * 60;
          }
          console.debug(delayToNextRequestInSeconds);
        }
      }
      return delayToNextRequestInSeconds * 1000;
    },
    queryFn: async () => {
      if (!dataUrl || !authKey) {
        throw new Error('Unexpected - dataUrl or authKey are not set');
      }
      const postResult = await fetch(
        `${dataUrl}?sessionId=${authKey}&minutes=1440&maxCount=100`,
        {
          method: dataReq.method || 'POST',
          mode: 'cors',
          headers: dataReq.headers,
          body: dataReq.method !== 'GET' ? '' : undefined,
        },
      );
      const { status, ok } = postResult;
      if (!ok) {
        const error = await postResult.text();
        throw new Error(`${status}: ${dataUrl} - ${error}`);
      }
      const apiReadings: IPlotDatum[] = await postResult.json();
      if (apiIsTestUrl) {
        updateTestReadingDateTimes(apiReadings);
      }
      console.debug('Latest Reading', apiReadings[0]);
      return apiReadings;
    },
    onSuccess: (data) => {
      const [latestReading] = data;
      if (latestReading) {
        const { readingIsOld } = extractDate(latestReading) || {};
        if (!readingIsOld) {
          playAudioIfNeeded(latestReading.Value, plotSettings);
        }
      }
    },
  });
  return {
    plotSettings,
    apiUrlsError,
    apiIsLoading:
      apiUrlsAreLoading ||
      authKeyIsLoading ||
      (readingsAreLoading && !readings),
    readings,
    readingsError,
  };
}
