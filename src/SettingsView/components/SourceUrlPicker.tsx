import { useEffect, useState } from 'react';
import { FlatList, Text, StyleSheet } from 'react-native';

interface IApiSourceUrl {
  name: string;
  sourceUrl: string;
}

interface Props {
  sourceUrl: string;
  setSourceUrl: (sourceUrl: string) => void;
}

function SourceUrlPicker(props: Props) {
  const { sourceUrl: currentSourceUrl, setSourceUrl } = props;
  const [apiSourceUrls, setApiSourceUrls] = useState<IApiSourceUrl[]>([]);
  const [urlsAreLoading, setUrlsAreLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    async function loadApiSourceUrls() {
      try {
        setError('');
        const response = await fetch(
          'https://jazcom.jazeee.com/api-sources/urls.json',
        );
        setUrlsAreLoading(false);
        if (response.status !== 200) {
          throw new Error('Unable to load sources');
        }
        const urlContainer = await response.json();
        const { sources: newApiSourceUrls } = urlContainer || {};
        console.debug('****Loaded****', newApiSourceUrls);
        setApiSourceUrls(newApiSourceUrls);
      } catch (apiError: any) {
        console.debug(apiError);
        setError(apiError.toString());
      }
    }
    loadApiSourceUrls();
  }, []);

  const loadingMessage = urlsAreLoading ? 'Loading...' : '';
  return (
    <>
      {loadingMessage ? <Text>{loadingMessage}</Text> : null}
      {error ? <Text>{error}</Text> : null}
      <FlatList
        style={styles.sourceUrls}
        data={apiSourceUrls.map((source) => {
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
