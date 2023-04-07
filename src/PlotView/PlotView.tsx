import React, { Component, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../common/colors';
import { extractDate, updateTestReadingDateTimes } from './utils';
import { DEFAULT_META } from './constants';
import { GlucoseGraph } from './components/GlucoseGraph';
import { Overlay } from './components/Overlay';
import { playAudioIfNeeded } from './playAudio';
import { isTestApi } from '../UserSettings/utils';
import { useSettingsContext } from '../UserSettings/SettingsProvider';
import { IApiUrl, IPlotDatum, IPlotSettings } from './types';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';

const plotMargin = 4;
const plotMarginX2 = plotMargin * 2;
const EXTRA_LATENCY_IN_SECONDS = 10 + 10 * Math.random();
interface Props {
  settings: Record<string, string>;
  apiUrls: IApiUrl;
  authKey: string;
  readings?: IPlotDatum[];
  plotSettings: IPlotSettings;
  logContent: string;
}

interface IPlotDimensions {
  plotWidth: number;
  plotHeight: number;
}

function PlotView(props: Props) {
  const [plotDimensions, setPlotDimensions] = useState<IPlotDimensions>({
    plotWidth: 0,
    plotHeight: 0,
  });
  const { plotWidth, plotHeight } = plotDimensions;
  const { readings, plotSettings, logContent } = props;
  const [latestReading] = readings ?? [];
  const { Trend: trend, Value: latestValue } = latestReading ?? {};
  const readingIsOld =
    latestReading && extractDate(latestReading)?.readingIsOld;
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setPlotDimensions({ plotWidth: width, plotHeight: height });
      }}>
      {plotWidth > plotMarginX2 && plotHeight > plotMarginX2 && (
        <View
          style={{
            ...styles.overlay,
            width: plotWidth - plotMarginX2,
            height: plotHeight - plotMarginX2,
          }}>
          <GlucoseGraph
            width={plotWidth - plotMarginX2}
            height={plotHeight - plotMarginX2}
            readings={readings}
            plotSettings={plotSettings}
          />
          <Text style={styles.overlayContent}>Loading...</Text>
        </View>
      )}
      <Overlay
        width={plotWidth}
        height={plotHeight}
        value={latestValue}
        trend={trend}
        readingIsOld={readingIsOld ?? false}
      />
      <Text style={styles.logContent}>
        {logContent}
        {readingIsOld && ' Outdated Reading'}
      </Text>
    </View>
  );
}

export function WrappedPlotView() {
  const { navigate } = useNavigation();
  const { settings } = useSettingsContext();
  const { sourceUrl } = settings;
  const apiIsTestUrl = isTestApi(sourceUrl);
  const { data: apiUrls, isLoading: apiUrlsAreLoading } = useQuery({
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
    queryKey: [authUrl],
    refetchInterval: 45 * 60 * 1000,
    queryFn: async () => {
      if (!authReq || !authUrl) {
        return;
      }
      const { username, password } = settings;
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
      return (await apiResult.json()) as string;
    },
  });

  const dataUrl = dataReq?.url;
  const {
    data: readings,
    isLoading: readingsAreLoading,
    error: readingsError,
  } = useQuery({
    queryKey: [dataUrl, authKey],
    enabled: Boolean(dataUrl) && Boolean(authKey),
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
        return;
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
      if (data) {
        const [latestReading] = data;
        if (latestReading) {
          const { readingIsOld } = extractDate(latestReading) || {};
          if (!readingIsOld) {
            playAudioIfNeeded(latestReading.Value, plotSettings);
          }
        }
      }
    },
  });

  if (
    apiUrlsAreLoading ||
    authKeyIsLoading ||
    (readingsAreLoading && !readings)
  ) {
    return (
      <View style={styles.container}>
        <Text style={styles.logContent}>Loading...</Text>
      </View>
    );
  }
  if (!apiUrls) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Problem loading API URLS...</Text>
        <Button
          color={COLORS.primary}
          onPress={() => navigate('SettingsView' as never)}
          title="Settings"
        />
      </View>
    );
  }
  return (
    <PlotView
      settings={settings}
      apiUrls={apiUrls}
      authKey={authKey ?? ''}
      readings={readings}
      plotSettings={plotSettings}
      logContent={readingsError ? String(readingsError) : 'Success'}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: plotMargin,
    left: plotMargin,
    opacity: 1,
  },
  overlayContent: {
    fontSize: 50,
    color: 'white',
    opacity: 0.2,
  },
  trend: {
    fontSize: 64,
    color: COLORS.primary,
  },
  message: {
    fontSize: 16,
    color: COLORS.primary,
  },
  logContent: {
    fontSize: 16,
    color: COLORS.primary,
    position: 'absolute',
    bottom: plotMargin * 6,
  },
});
