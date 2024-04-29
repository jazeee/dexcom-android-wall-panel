/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, Text, Button, ScrollView, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS } from '../common/colors';
import { SettingsConsumer } from '../UserSettings/context';
import DateTime from '../common/components/DateTime';
import { extractDate, getIconName } from './utils';
import GlucoseGraph from './components/GlucoseGraph.js';
import { safePlayAudio } from './playAudio';

const plotMargin = 4;
const plotMarginX2 = plotMargin * 2;
const EXTRA_LATENCY_IN_SECONDS = 10 + 10 * Math.random();
type Props = {};

type State = {
  sourceUrls: object,
  value: number,
  trend: number,
  timeSinceLastReadingInSeconds: number,
  isOldReading: boolean,
  readings: PropTypes.array,
  response: '',
  width: number,
  height: number,
};

const DEFAULT_SOURCE = 'dx';
const LOW_ALARM_VALUE = 55;
// See https://github.com/facebook/react-native/issues/12981
console.ignoredYellowBox = ['Setting a timer'];

class PlotView extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      trend: -1,
      timeSinceLastReadingInSeconds: undefined,
      isOldReading: undefined,
      response: '',
      sourceUrls: {},
      isSetupDialogVisible: false,
    };
    this.authKey = '';
    this.lastUpdatedAuthKey = 0;
    this.lastAlarmTime = 0;
    this.lastTimeoutId = 0;
    this.failureCount = 0;
  }

  componentDidMount = () => {
    this.isThisMounted = true;
    this.getData(true);
  };

  componentDidUpdate = prevProps => {
    const { state: prevState } = prevProps;
    const { state } = this.props;
    if (
      prevState.username !== state.username ||
      prevState.password !== state.password
    ) {
      this.setState(
        { readings: [], value: 0, isOldReading: true },
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

  getUrls = async (source = DEFAULT_SOURCE) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(
          `https://jazcom.jazeee.com/${source}/urls.json`,
        );
        const { status } = response;
        if (status !== 200) {
          throw new Error(await response.text());
        }
        const urls = await response.json();
        if (!urls) {
          throw new Error('No URL JSON content');
        }
        this.setState(
          ({ sourceUrls }) => ({
            sourceUrls: {
              ...sourceUrls,
              [source]: urls,
            },
          }),
          () => {
            resolve(urls);
          },
        );
      } catch (error) {
        this.setState({ response: error.toString() });
        reject(error);
      }
    });
  };

  getData = async (forceReload = false) => {
    if (!this.isThisMounted) {
      return;
    }
    const { username, password } = this.props.state;
    if (!username || !password) {
      this.setState({ response: 'Need username and password!' });
      this.props.navigation.navigate('SettingsView');
      return;
    }
    let delayToNextRequestInSeconds = 5 * 60;
    const currentTime = new Date().getTime();
    try {
      const { sourceUrls } = this.state;
      const isSampleUser = username.startsWith('sample');
      const source = isSampleUser ? username : DEFAULT_SOURCE;
      let urls = sourceUrls[source];
      if (!urls) {
        urls = await this.getUrls(source);
      }
      const { auth: authReq, data: dataReq } = urls;
      if (
        forceReload ||
        currentTime - this.lastUpdatedAuthKey > 45 * 60 * 1000
      ) {
        this.lastUpdatedAuthKey = currentTime;
        // Load auth key
        const { method = 'POST' } = authReq;
        const postResult = await fetch(authReq.url, {
          method,
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
        const { status } = postResult;
        if (status !== 200) {
          throw new Error(`Unable to ${method} Username`);
        }
        this.authKey = await postResult.json();
      }
      if (!this.authKey) {
        throw new Error('Unable to load auth key');
      }
      const postResult = await fetch(
        `${dataReq.url}?sessionId=${this.authKey}&minutes=1440&maxCount=100`,
        {
          method: dataReq.method || 'POST',
          headers: dataReq.headers,
          body: dataReq.method !== 'GET' ? '' : undefined,
        },
      );
      const { status } = postResult;
      if (status !== 200) {
        throw new Error(await postResult.text());
      }
      const readings = await postResult.json();
      const [firstReading] = readings;
      if (isSampleUser) {
        const firstReadingDate = extractDate(firstReading);
        readings.forEach(reading => {
          const readingDate = extractDate(reading);
          const updatedTimeInMilliseconds =
            Date.now() +
            readingDate.timeInMilliseconds -
            firstReadingDate.timeInMilliseconds;
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
        response: `Success for user: ${username}`,
        trend,
        value,
        timeSinceLastReadingInSeconds,
        isOldReading,
        readings,
      });
      if (!isOldReading && value <= LOW_ALARM_VALUE) {
        if (currentTime - this.lastAlarmTime >= 30 * 60 * 1000) {
          this.lastAlarmTime = currentTime;
          safePlayAudio('eat_please.mp3');
        }
      }
      delayToNextRequestInSeconds = 5 * 60 - timeSinceLastReadingInSeconds;
      delayToNextRequestInSeconds =
        Math.max(2 * 60, delayToNextRequestInSeconds) +
        EXTRA_LATENCY_IN_SECONDS;
      this.failureCount = 0;
      if (isSampleUser) {
        delayToNextRequestInSeconds = 4 * 60 * 60;
      }
    } catch (error) {
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
      response,
      isOldReading,
      width,
      height,
    } = this.state;
    return (
      <View
        style={styles.container}
        onLayout={event => {
          const { width, height } = event.nativeEvent.layout;
          this.setState({ width, height });
        }}>
        {width > plotMarginX2 && height > plotMarginX2 && (
          <View
            style={{
              ...styles.overlay,
              width: width - plotMarginX2,
              height: height - plotMarginX2,
            }}>
            <GlucoseGraph
              width={width - plotMarginX2}
              height={height - plotMarginX2}
              readings={readings}
            />
            <Text style={styles.overlayContent}>Loading...</Text>
          </View>
        )}
        <ScrollView style={styles.innerContainer}>
          <Text
            style={
              // eslint-disable-next-line react-native/no-inline-styles
              {
                ...styles.value,
                fontSize: 180 - (width > 480 ? 0 : 60),
                color: isOldReading ? '#666' : COLORS.primary,
              }
            }>
            {value ? value : '-'}{' '}
            {isOldReading && (
              <Icon name="question" size={width > 480 ? 120 : 80} />
            )}
            <Icon name={getIconName(trend)} size={width > 480 ? 120 : 80} />
            {(trend === 1 || trend === 7) && (
              <Icon name={this.getIconName()} size={width > 480 ? 120 : 80} />
            )}
          </Text>
        </ScrollView>
        <Text style={styles.response}>
          {response}
          {isOldReading && ' Outdated Reading'}
        </Text>
      </View>
    );
  }
}

const WrappedPlotView = props => {
  return (
    <SettingsConsumer>
      {({ state }) => <PlotView {...props} state={state} />}
    </SettingsConsumer>
  );
};

WrappedPlotView.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: () => (
      <Fragment>
        <DateTime style={styles.dateTime} />
      </Fragment>
    ),
    headerRight: (
      <Fragment>
        <Button
          color={COLORS.primary}
          onPress={() => navigation.navigate('SettingsView')}
          title="Settings"
        />
      </Fragment>
    ),
  };
};

export default WrappedPlotView;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  innerContainer: {},
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
  value: {
    fontSize: 180,
    color: COLORS.primary,
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
