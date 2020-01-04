import React, { Component } from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';

type Props = {
  sourceUrl: string,
  setSourceUrl: (sourceUrl: string) => {},
};

type State = {
  apiSourceUrls: [],
  loadingMessage: string,
};

class SourceUrlPicker extends Component<Props, State> {
  state = {
    apiSourceUrls: [],
    loadingMessage: 'Loading...',
  };

  componentDidMount() {
    this.loadApiSourceUrls();
  }

  loadApiSourceUrls = async () => {
    try {
      const response = await fetch(
        'https://jazcom.jazeee.com/api-sources/urls.json',
      );
      this.setState({ loadingMessage: 'Loaded...' });
      if (response.status !== 200) {
        throw new Error('Unable to load sources');
      }
      const urlContainer = await response.json();
      const { sources: apiSourceUrls } = urlContainer || {};
      console.debug('****Loaded****', apiSourceUrls);
      this.setState({ apiSourceUrls, loadingMessage: '' });
      // this.setState({ apiSourceUrls, loadingMessage: JSON.stringify(apiSourceUrls) })
    } catch (error) {
      console.debug(error);
      this.setState({ loadingMessage: error.toString() });
    }
  };

  render() {
    const { apiSourceUrls, loadingMessage } = this.state;
    const { sourceUrl: currentSourceUrl, setSourceUrl } = this.props;
    return (
      <>
        {loadingMessage ? <Text>{loadingMessage}</Text> : null}
        <FlatList
          style={styles.sourceUrls}
          data={apiSourceUrls.map(source => {
            const { name, sourceUrl } = source;
            return {
              key: name,
              sourceUrl,
            };
          })}
          renderItem={({ item }) => {
            const { key, sourceUrl } = item;
            const isSelected = currentSourceUrl === sourceUrl;
            const style = isSelected ? styles.selectedApi : {};
            return (
              <Text
                style={{
                  ...styles.apiListItem,
                  ...style,
                }}
                onPress={() => setSourceUrl(sourceUrl)}
                key={key}>
                {key}
              </Text>
            );
          }}
        />
      </>
    );
  }
}

export default SourceUrlPicker;

const styles = StyleSheet.create({
  sourceUrls: {
    flex: 1,
  },
  apiListItem: {
    fontSize: 16,
    padding: 8,
  },
  selectedApi: {
    fontWeight: 'bold',
  },
});
