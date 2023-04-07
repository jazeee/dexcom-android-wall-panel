import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../common/colors';
import { extractDate, updateTestReadingDateTimes } from './utils';
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
  authKey: string;
}

interface State {
  readings?: IPlotDatum[];
  response: string;
  plotWidth: number;
  plotHeight: number;
  plotSettings: IPlotSettings;
}

class PlotView extends Component<Props, State> {
  lastUpdatedAuthKey: number;
  lastTimeoutId: number;
  failureCount: number;
  isThisMounted: boolean | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      response: '',
      plotSettings: DEFAULT_META,
      plotWidth: 100,
      plotHeight: 100,
    };
    this.lastUpdatedAuthKey = 0;
    this.lastTimeoutId = 0;
    this.failureCount = 0;
  }

  componentDidMount = () => {
    this.isThisMounted = true;
    this.getData();
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
        { readings: [], response: 'Loading...' },
        this.getData.bind(this),
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

  getData = async () => {
    if (!this.isThisMounted) {
      return;
    }
    const { apiUrls, settings } = this.props;
    const { sourceUrl } = settings;
    const apiIsTestUrl = isTestApi(sourceUrl);
    let delayToNextRequestInSeconds = 5 * 60;
    try {
      const { data: dataReq, meta = DEFAULT_META } = apiUrls ?? ({} as IApiUrl);
      const postResult = await fetch(
        `${dataReq.url}?sessionId=${this.props.authKey}&minutes=1440&maxCount=100`,
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
      const readings: IPlotDatum[] = await postResult.json();
      if (apiIsTestUrl) {
        updateTestReadingDateTimes(readings);
      }
      const [latestReading] = readings;
      const { Value: value } = latestReading;
      const { timeSinceLastReadingInSeconds, readingIsOld } =
        extractDate(latestReading) || {};
      if (!this.isThisMounted) {
        return;
      }
      this.setState({
        response: 'Success',
        readings,
        plotSettings: meta,
      });
      if (!readingIsOld) {
        playAudioIfNeeded(value, meta);
      }
      delayToNextRequestInSeconds =
        5 * 60 - (timeSinceLastReadingInSeconds ?? 0);
      delayToNextRequestInSeconds =
        Math.max(2 * 60, delayToNextRequestInSeconds) +
        EXTRA_LATENCY_IN_SECONDS;
      console.log(delayToNextRequestInSeconds);
      this.failureCount = 0;
      if (apiIsTestUrl) {
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
    const { readings, response, plotWidth, plotHeight, plotSettings } =
      this.state;
    const [latestReading] = readings ?? [];
    const { Trend: trend, Value: latestValue } = latestReading ?? {};
    const readingIsOld =
      latestReading && extractDate(latestReading)?.readingIsOld;
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
          value={latestValue}
          trend={trend}
          readingIsOld={readingIsOld ?? false}
        />
        <Text style={styles.response}>
          {response}
          {readingIsOld && ' Outdated Reading'}
        </Text>
      </View>
    );
  }
}

export function WrappedPlotView() {
  const navigation = useNavigation();
  const { settings } = useSettingsContext();
  const { sourceUrl } = settings;
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
  const { auth: authReq } = apiUrls ?? ({} as IApiUrl);
  const { method = 'POST', url: authUrl } = authReq ?? {};
  const { data: authKey, isLoading: authKeyIsLoading } = useQuery({
    enabled: Boolean(apiUrls),
    queryKey: [authUrl],
    refetchInterval: 45 * 60 * 1000,
    queryFn: async () => {
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

  if (apiUrlsAreLoading || authKeyIsLoading) {
    return (
      <View>
        <Text style={styles.response}>Loading...</Text>
      </View>
    );
  }
  return (
    <PlotView
      settings={settings}
      navigation={navigation}
      apiUrls={apiUrls}
      authKey={authKey ?? ''}
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
  response: {
    fontSize: 16,
    color: COLORS.primary,
    position: 'absolute',
    bottom: plotMargin * 6,
  },
});
