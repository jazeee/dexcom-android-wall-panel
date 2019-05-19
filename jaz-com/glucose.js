/**
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {AsyncStorage, StyleSheet, Text, View, Button} from 'react-native';
import { JazComAccountDialog } from "./setup-dialog.js";

type Props = {
};

type State = {
  username: string,
  password: string,
  value: number,
  trend: number,
  response: "",
}

export class JazComGlucose extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      trend: -1,
      response: "",
      username: "",
      password: "",
    };
    this.authKey = "";
    this.lastUpdatedAuthKey = 0;
    this.lastTimeoutId = 0;
  }

  componentDidMount = () => {
    this.updateCredsFromStore();
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

  getGlucose = async () => {
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
      const postResult = await fetch(`https://share1.dexcom.com/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues?sessionId=${this.authKey}&minutes=1440&maxCount=1`, {
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
      const values = await postResult.json();
      const [firstValue] = values;
      const { Trend: trend, Value: value } = firstValue;
      this.setState({ response: "Success!", trend, value });
    } catch (error) {
      console.log(error);
      this.setState({ response: error.toString() });
    };
    if (this.lastTimeoutId !== 0) {
      clearTimeout(this.lastTimeoutId)
    }
    this.lastTimeoutId = setTimeout(this.getGlucose.bind(this), 5 * 60 * 1000);
  };

  render() {
    const { value, trend, response, username, password } = this.state;
    return (
      <View style={styles.container}>
        <Button
          onPress={this.getGlucose}
          title={`Refresh`}
          color="#841584"
          accessibilityLabel="Refresh"
        />
        <Text style={styles.value}>{value ? value : "-"}</Text>
        <Text style={styles.trend}>{trend !== -1 ? trend : "-"}</Text>
        <JazComAccountDialog
          setCreds={this.setCreds}
          username={username}
          password={password}
        />
        <Text style={styles.response}>{response}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002',
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
