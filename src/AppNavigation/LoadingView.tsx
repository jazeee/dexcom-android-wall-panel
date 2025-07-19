import { ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { InsetView } from '../common/components/InsetView';

export function LoadingView() {
  return (
    <InsetView style={styles.container}>
      <ActivityIndicator size={128} />
      <StatusBar barStyle="default" />
    </InsetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
