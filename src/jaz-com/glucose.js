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
import { JazComAccountDialog } from "./setup-dialog.js";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { extractDate } from "./utils";
import { GlucoseGraph } from "./glucose-graph.js";

const plotMargin = 5;
const plotMarginX2 = plotMargin * 2;
type Props = {
};

type State = {
  username: string,
  password: string,
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

export class JazComGlucose extends Component<Props, State> {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Glucose',
      headerRight: (
        <Fragment>
          <Button
            onPress={() => navigation.getParam("setIsSetupDialogVisible")(true)}
            title={`Set up Account`}
            accessibilityLabel="Set up Account"
          />
          <Button
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
      this.setState({ username, password, response: "Loaded user/pass" }, this.getGlucose);
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
    this.setState({ username, password }, this.getGlucose);
  };

  setIsSetupDialogVisible = (isSetupDialogVisible) => this.setState({ isSetupDialogVisible });

  getGlucose = async () => {
    if (!this.isThisMounted) {
      return;
    }
    const { username, password } = this.state;
    if (!username || !password) {
      this.setState({ response: "Need username and password!"});
      return;
    }
    const currentTime = new Date().getTime();
    try {
      if (currentTime - this.lastUpdatedAuthKey > 30 * 60 * 1000) {
        // Load auth key
          const postResult = await fetch('https://share1.dexcom.com/ShareWebServices/Services/General/LoginPublisherAccountByName', {
            method: "POST",
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              "User-Agent": "Dexcom Share/3.0.2.11 CFNetwork/711.2.23 Darwin/14.0.0",
            },
            body: JSON.stringify({
              accountName: username,
              password,
              applicationId: "d8665ade-9673-4e27-9ff6-92db4ce13d13",
            })
          });
          const { status } = postResult;
          if (status !== 200) {
            throw new Error("Unable to Post Username");
          }
          this.authKey = await postResult.json();
      }
      this.lastUpdatedAuthKey = currentTime;
      if (!this.authKey) {
        throw new Error("Unable to load auth key");
      }
      const postResult = await fetch(`https://share1.dexcom.com/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues?sessionId=${this.authKey}&minutes=1440&maxCount=100`, {
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "User-Agent": "Dexcom Share/3.0.2.11 CFNetwork/711.2.23 Darwin/14.0.0",
        },
        body: JSON.stringify({
          accountName: username,
          password,
          applicationId: "d8665ade-9673-4e27-9ff6-92db4ce13d13",
        })
      });
      const { status } = postResult;
      if (status !== 200) {
        throw new Error(await postResult.text());
      }
      const readings = await postResult.json();
      const [firstReading] = readings;
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
      this.failureCount = 0;
    } catch (error) {
      console.log(error);
      this.setState({ response: error.toString() });
      this.failureCount += 1;
    };
    if (this.lastTimeoutId !== 0) {
      clearTimeout(this.lastTimeoutId)
    }
    this.lastTimeoutId = setTimeout(this.getGlucose.bind(this), (this.failureCount + 1) * 5 * 60 * 1000);
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
          <Text style={{...styles.value, fontSize: 180 - (width > 480 ? 0 : 60)}}>
            {value ? value : "-"}{" "}
            <Icon name={this.getIconName()} size={width > 480 ? 120 : 80} />
            {(trend === 1 || trend === 7 )&& (
              <Icon name={this.getIconName()} size={width > 480 ? 120 : 80} />
            )}
          </Text>
          <JazComAccountDialog
            setCreds={this.setCreds}
            username={username}
            password={password}
            isSetupDialogVisible={isSetupDialogVisible}
            setIsSetupDialogVisible={this.setIsSetupDialogVisible}
          />
          <Text style={styles.response}>
            {response}
            {isOldReading && "Outdated Reading"}
          </Text>
        </ScrollView>
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
    backgroundColor: '#002',
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
    color: "#841584",
  },
  trend: {
    fontSize: 64,
    color: "#841584",
  },
  response: {
    fontSize: 16,
    color: "#841584",
  },
});
