import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../common/colors';
import { extractDate } from './utils';
import { DEFAULT_META } from './constants';
import { GlucoseGraph } from './components/GlucoseGraph';
import { Overlay } from './components/Overlay';
import { playAudioIfNeeded } from './playAudio';
import { isTestApi } from '../UserSettings/utils';
import { useSettingsContext } from '../UserSettings/SettingsProvider';
import { useNavigation } from '@react-navigation/native';
import { IApiUrl, IPlotDatum, IPlotSettings } from './types';
import { useQuery } from '@tanstack/react-query';

const plotMargin = 4;
const plotMarginX2 = plotMargin * 2;
const EXTRA_LATENCY_IN_SECONDS = 10 + 10 * Math.random();
interface Props {
  settings: Record<string, string>;
  // FIXME refactor
  navigation: any;
  apiUrls: IApiUrl | undefined;
}

interface State {
  value: number;
  trend: number;
  timeSinceLastReadingInSeconds: number | undefined;
  isOldReading: boolean | undefined;
  readings?: IPlotDatum[];
  lastUrl: string;
  response: string;
  plotWidth: number;
  plotHeight: number;
  plotSettings: IPlotSettings;
}

class PlotView extends Component<Props, State> {
  authKey: string;
  lastUpdatedAuthKey: number;
  lastTimeoutId: number;
  failureCount: number;
  isThisMounted: boolean | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0,
      trend: -1,
      timeSinceLastReadingInSeconds: undefined,
      isOldReading: undefined,
      lastUrl: '',
      response: '',
      plotSettings: DEFAULT_META,
      plotWidth: 100,
      plotHeight: 100,
    };
    this.authKey = '';
    this.lastUpdatedAuthKey = 0;
    this.lastTimeoutId = 0;
    this.failureCount = 0;
  }

  componentDidMount = () => {
    this.isThisMounted = true;
    this.getData(true);
  };

  componentDidUpdate = (prevProps: Props) => {
    const { settings: prevSettings } = prevProps;
    const { settings } = this.props;
    if (
      prevSettings.username !== settings.username ||
      prevSettings.password !== settings.password ||
      prevSettings.sourceUrl !== settings.sourceUrl
    ) {
      this.setState(
        { readings: [], value: 0, response: 'Loading...' },
        this.getData.bind(this, true),
      );
    }
  };

  componentWillUnmount = () => {
    this.isThisMounted = false;
    if (this.lastTimeoutId !== 0) {
      clearTimeout(this.lastTimeoutId);
    }
    this.lastTimeoutId = 0;
  };

  getData = async (forceReload = false) => {
    if (!this.isThisMounted) {
      return;
    }
    const { apiUrls, settings } = this.props;
    const { username, password, sourceUrl } = settings;
    const usingTestApi = isTestApi(sourceUrl);
    if (!sourceUrl) {
      this.setState({ response: 'Need source!' });
      this.props.navigation.navigate('SettingsView');
      return;
    }
    if (!usingTestApi) {
      if (!username || !password || username === 'sample') {
        this.setState({ response: 'Need username and password!' });
        this.props.navigation.navigate('SettingsView');
        return;
      }
    }
    let delayToNextRequestInSeconds = 5 * 60;
    const currentTime = Date.now();
    try {
      const {
        auth: authReq,
        data: dataReq,
        meta = DEFAULT_META,
      } = apiUrls ?? ({} as IApiUrl);
      if (
        forceReload ||
        currentTime - this.lastUpdatedAuthKey > 45 * 60 * 1000
      ) {
        this.lastUpdatedAuthKey = currentTime;
        // Load auth key
        const { method = 'POST' } = authReq;
        this.setState({ lastUrl: authReq.url });
        const postResult = await fetch(authReq.url, {
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
        const { status, ok } = postResult;
        if (!ok) {
          throw new Error(`${status}: Unable to ${method} Username`);
        }
        this.authKey = await postResult.json();
      }
      if (!this.authKey) {
        throw new Error('Unable to load auth key');
      }
      this.setState({ lastUrl: dataReq.url });
      const postResult = await fetch(
        `${dataReq.url}?sessionId=${this.authKey}&minutes=1440&maxCount=100`,
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
        throw new Error(`${status}: ${dataReq.url} - ${error}`);
      }
      const readings = await postResult.json();
      const [firstReading] = readings;
      if (usingTestApi) {
        const firstReadingDate = extractDate(firstReading);
        readings.forEach((reading: IPlotDatum) => {
          const readingDate = extractDate(reading);
          const updatedTimeInMilliseconds =
            Date.now() +
            (readingDate?.timeInMilliseconds ?? 0) -
            (firstReadingDate?.timeInMilliseconds ?? 0);
          reading.ST = `/Date(${updatedTimeInMilliseconds})/`;
        });
      }
      const { Trend: trend, Value: value } = firstReading;
      const { timeSinceLastReadingInSeconds, isOldReading } =
        extractDate(firstReading) || {};
      if (!this.isThisMounted) {
        return;
      }
      this.setState({
        response: `Success for user: ${usingTestApi ? 'Test user' : username}`,
        trend,
        value,
        timeSinceLastReadingInSeconds,
        isOldReading,
        readings,
        plotSettings: meta,
      });
      if (!isOldReading) {
        playAudioIfNeeded(value, meta);
      }
      delayToNextRequestInSeconds =
        5 * 60 - (timeSinceLastReadingInSeconds ?? 0);
      delayToNextRequestInSeconds =
        Math.max(2 * 60, delayToNextRequestInSeconds) +
        EXTRA_LATENCY_IN_SECONDS;
      this.failureCount = 0;
      if (usingTestApi) {
        delayToNextRequestInSeconds = 4 * 60 * 60;
      }
    } catch (error: any) {
      console.log(error);
      this.setState({ response: error.toString() });
      this.failureCount += 1;
    }
    if (this.lastTimeoutId !== 0) {
      clearTimeout(this.lastTimeoutId);
    }
    this.lastTimeoutId = setTimeout(
      this.getData.bind(this),
      (this.failureCount + 1) * delayToNextRequestInSeconds * 1000,
    );
  };

  render() {
    const {
      value,
      trend,
      readings,
      lastUrl,
      response,
      isOldReading,
      plotWidth,
      plotHeight,
      plotSettings,
    } = this.state;
    return (
      <View
        style={styles.container}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          this.setState({ plotWidth: width, plotHeight: height });
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
          value={value}
          trend={trend}
          isOldReading={isOldReading ?? false}
        />
        <Text style={styles.response}>
          {response.includes('Error') ? lastUrl + ' ' : ''}
          {response}
          {isOldReading && ' Outdated Reading'}
        </Text>
      </View>
    );
  }
}

export function WrappedPlotView() {
  const navigation = useNavigation();
  const { settings } = useSettingsContext();
  const { sourceUrl } = settings;
  const { data, isLoading } = useQuery({
    queryKey: [sourceUrl, 'urls.json'],
    queryFn: async () => {
      console.log(`Requesting from ${sourceUrl}`);
      const lastUrl = `${sourceUrl}/urls.json`;
      const response = await fetch(lastUrl);
      const { status, ok } = response;
      if (!ok) {
        const apiError = await response.text();
        throw new Error(`${status}: ${apiError}`);
      }
      const apiUrls: IApiUrl = await response.json();
      if (!apiUrls) {
        throw new Error('No URL JSON content');
      }
      console.debug('Got API Urls', apiUrls);
      return apiUrls;
    },
  });
  if (isLoading) {
    return (
      <View>
        <Text style={styles.response}>Loading...</Text>
      </View>
    );
  }
  return (
    <PlotView settings={settings} navigation={navigation} apiUrls={data} />
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
  response: {
    fontSize: 16,
    color: COLORS.primary,
    position: 'absolute',
    bottom: plotMargin * 6,
  },
});
