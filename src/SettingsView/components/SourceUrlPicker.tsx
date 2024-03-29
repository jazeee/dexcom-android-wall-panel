import { useQuery } from '@tanstack/react-query';
import { FlatList, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../common/colors';

interface IApiSourceUrl {
  name: string;
  sourceUrl: string;
}

interface Props {
  sourceUrl: string;
  setSourceUrl: (sourceUrl: string) => void;
}

const API_SOURCES_URL = 'https://jazcom.jazeee.com/api-sources/urls.json';
export function SourceUrlPicker(props: Props) {
  const { sourceUrl: currentSourceUrl, setSourceUrl } = props;

  const {
    isLoading: urlsAreLoading,
    data: apiSourceUrls,
    error,
  } = useQuery({
    queryKey: ['api'],
    queryFn: async () => {
      const response = await fetch(API_SOURCES_URL);
      if (response.status !== 200) {
        throw new Error('Unable to load sources');
      }
      const responseValues: {
        sources: IApiSourceUrl[];
      } = await response.json();
      console.log(responseValues);
      const { sources } = responseValues || {};
      return sources ?? [];
    },
    onError: (apiError: Error) => {
      console.error(apiError);
    },
  });

  const loadingMessage = urlsAreLoading ? 'Loading...' : '';
  return (
    <>
      {loadingMessage ? (
        <Text style={styles.loading}>{loadingMessage}</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error.toString()}</Text> : null}
      <FlatList
        style={styles.sourceUrls}
        data={apiSourceUrls?.map((source) => {
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

const styles = StyleSheet.create({
  sourceUrls: {
    flex: 1,
  },
  loading: {
    color: COLORS.primary,
  },
  error: {
    color: COLORS.primary,
  },
  apiListItem: {
    fontSize: 16,
    padding: 8,
    color: COLORS.primary,
  },
  selectedApi: {
    fontWeight: 'bold',
  },
});
