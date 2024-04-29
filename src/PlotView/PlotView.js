/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component, Fragment} from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  Button,
  ScrollView,
  View,
} from 'react-native';
import AccountDialog from "./AccountDialog.js";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { COLORS } from '../common/colors';
import DateTime from '../common/components/DateTime';
import { extractDate } from "./utils";
import GlucoseGraph from "./GlucoseGraph.js";

const plotMargin = 4;
const plotMarginX2 = plotMargin * 2;
const EXTRA_LATENCY_IN_SECONDS = 10 + 10 * Math.random();
type Props = {
};

type State = {
  username: string,
  password: string,
  urls: object,
  isSetupDialogVisible: boolean,
  value: number,
  trend: number,
  timeSinceLastReadingInSeconds: number,
  isOldReading: boolean,
  readings: PropTypes.array,
  response: "",
  width: 0,
  height: 0,
}

export default class PlotView extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
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
            onPress={() => navigation.getParam("setIsSetupDialogVisible")(true)}
            title={`Set up Account`}
            accessibilityLabel="Set up Account"
          />
          <Button
            color={COLORS.primary}
            onPress={() => navigation.navigate('Home')}
            title="Home"
          />
        </Fragment>
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      trend: -1,
      timeSinceLastReadingInSeconds: undefined,
      isOldReading: undefined,
      response: "",
      username: "",
      password: "",
      urls: undefined,
      isSetupDialogVisible: false,
    };
    this.authKey = "";
    this.lastUpdatedAuthKey = 0;
    this.lastTimeoutId = 0;
    this.failureCount = 0;
  }

  componentDidMount = () => {
    this.isThisMounted = true;
    this.updateCredsFromStore();
    this.props.navigation.setParams({ setIsSetupDialogVisible: this.setIsSetupDialogVisible });
  }
  componentWillUnmount = () => {
    this.isThisMounted = false;
    if (this.lastTimeoutId !== 0) {
      clearTimeout(this.lastTimeoutId);
    }
    this.lastTimeoutId = 0;
  }
  updateCredsFromStore = async () => {
    try {
      const username = (await AsyncStorage.getItem('@jazcom:username')) || "";
      const password = (await AsyncStorage.getItem('@jazcom:password')) || "";
      this.setState({ username, password, response: "Loaded user/pass" }, this.getData);
    } catch (error) {
      this.setState({ response: error.toString() });
    }
  };

  setCreds = async (username, password) => {
    try {
      await AsyncStorage.setItem('@jazcom:username', username);
      await AsyncStorage.setItem('@jazcom:password', password);
    } catch (error) {
      this.setState({ response: error.toString() });
    }
    this.setState({ username, password }, this.getData);
  };

  setIsSetupDialogVisible = (isSetupDialogVisible) => this.setState({ isSetupDialogVisible });

  getUrls = async (source = "dx") => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`https://jazcom.jazeee.com/${source}/urls.json`);
        const { status } = response;
        if (status !== 200) {
          throw new Error(await postResult.text());
        }
        const urls = await response.json();
        if (!urls) {
          throw new Error("No URL JSON content");
        }
        this.setState({ urls }, () => {
          resolve(urls);
        });
      } catch (error) {
        this.setState({ response: error.toString() });
        reject(error);
      }
    });
  }

  getData = async () => {
    if (!this.isThisMounted) {
      return;
    }
    const { username, password } = this.state;
    if (!username || !password) {
      this.setState({ response: "Need username and password!"});
      return;
    }
    let delayToNextRequestInSeconds = 5 * 60;
    const currentTime = new Date().getTime();
    try {
      let { urls } = this.state;
      const isSampleUser = username === 'sample';
      if (!urls) {
        const source = isSampleUser ? 'sample': undefined;
        urls = await this.getUrls(source);
      }
      const {
        auth: authReq,
        data: dataReq,
      } = urls;
      if (currentTime - this.lastUpdatedAuthKey > 45 * 60 * 1000) {
        this.lastUpdatedAuthKey = currentTime;
        // Load auth key
        const postResult = await fetch(authReq.url, {
            method: authReq.method || "POST",
            headers: authReq.headers,
            body: authReq.method !== "GET" ? JSON.stringify({
              ...authReq.bodyBase,
              accountName: username,
              password,
            }): undefined,
          });
          const { status } = postResult;
          if (status !== 200) {
            throw new Error("Unable to Post Username");
          }
          this.authKey = await postResult.json();
      }
      if (!this.authKey) {
        throw new Error("Unable to load auth key");
      }
      const postResult = await fetch(`${dataReq.url}?sessionId=${this.authKey}&minutes=1440&maxCount=100`, {
        method: dataReq.method || "POST",
        headers: dataReq.headers,
        body: dataReq.method !== "GET" ? '' : undefined,
      });
      const { status } = postResult;
      if (status !== 200) {
        throw new Error(await postResult.text());
      }
      const readings = await postResult.json();
      const [firstReading] = readings;
      if (isSampleUser) {
        const firstReadingDate = extractDate(firstReading);
        for (reading of readings) {
          const readingDate = extractDate(reading);
          const updatedTimeInMilliseconds = Date.now() + readingDate.timeInMilliseconds - firstReadingDate.timeInMilliseconds;
          reading.ST = `/Date(${updatedTimeInMilliseconds})/`;
        }
      }
      const { Trend: trend, Value: value } = firstReading;
      const { timeSinceLastReadingInSeconds, isOldReading } = extractDate(firstReading) || {};
      if (!this.isThisMounted) {
        return;
      }
      this.setState({
        response: "Success!",
        trend,
        value,
        timeSinceLastReadingInSeconds,
        isOldReading,
        readings,
      });
      delayToNextRequestInSeconds = (5 * 60) - timeSinceLastReadingInSeconds;
      delayToNextRequestInSeconds = Math.max(2 * 60, delayToNextRequestInSeconds) + EXTRA_LATENCY_IN_SECONDS;
      this.failureCount = 0;
      if (isSampleUser) {
        delayToNextRequestInSeconds = 4 * 60 * 60;
      }
    } catch (error) {
      console.log(error);
      this.setState({ response: error.toString() });
      this.failureCount += 1;
    };
    if (this.lastTimeoutId !== 0) {
      clearTimeout(this.lastTimeoutId)
    }
    this.lastTimeoutId = setTimeout(this.getData.bind(this), (this.failureCount + 1) * delayToNextRequestInSeconds * 1000);
  };

  getIconName = () => {
    // https://materialdesignicons.com/
    switch (this.state.trend) {
      case 1:
      return "arrow-up-thick";
      case 2:
      return "arrow-up";
      case 3:
      return "arrow-top-right";
      case 4:
      return "arrow-right";
      case 5:
      return "arrow-bottom-right";
      case 6:
      return "arrow-down";
      case 7:
      return "arrow-down-thick";
      default:
      return "question";
    }
  }

  render() {
    const {
      value,
      trend,
      date,
      readings,
      response,
      username,
      password,
      isSetupDialogVisible,
      isOldReading,
      width,
      height,
    } = this.state;
    return (
      <View style={styles.container} onLayout={
        (event) => {
          const {width, height} = event.nativeEvent.layout;
          this.setState({ width, height });
        }}>
        { width > plotMarginX2 && height > plotMarginX2 &&
          <View style={{...styles.overlay, width: width - plotMarginX2, height: height - plotMarginX2}}>
            <GlucoseGraph
              width={width - plotMarginX2}
              height={height - plotMarginX2}
              readings={readings}
            />
            <Text style={styles.overlayContent}>
              Overlay
            </Text>
          </View>
        }
        <ScrollView style={styles.innerContainer}>
          <Text style={{
            ...styles.value,
            fontSize: 180 - (width > 480 ? 0 : 60),
            color: isOldReading ? "#666" : COLORS.primary,
          }}>
            {value ? value : "-"}{" "}
            {isOldReading && (
              <Icon
                name="question"
                size={width > 480 ? 120 : 80}
              />
            )}
            <Icon name={this.getIconName()} size={width > 480 ? 120 : 80} />
            {(trend === 1 || trend === 7 )&& (
              <Icon name={this.getIconName()} size={width > 480 ? 120 : 80} />
            )}
          </Text>
          <AccountDialog
            setCreds={this.setCreds}
            username={username}
            password={password}
            isSetupDialogVisible={isSetupDialogVisible}
            setIsSetupDialogVisible={this.setIsSetupDialogVisible}
          />
        </ScrollView>
        <Text style={styles.response}>
          {response}
          {isOldReading && " Outdated Reading"}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  innerContainer: {
  },
  overlay: {
    position: "absolute",
    top: plotMargin,
    left: plotMargin,
    opacity: 1,
  },
  overlayContent: {
    fontSize: 150,
    color: "white",
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
    position: "absolute",
    bottom: plotMarginX2,
  },
});
