import { Button, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../common/colors';
import { extractDate } from './utils';
import { GlucoseGraph } from './components/GlucoseGraph';
import { Overlay } from './components/Overlay';
import { useNavigation } from '@react-navigation/native';
import { useReadings } from './useReadings';
import { IPlotDimensions } from './types';
import { InsetView } from '../common/components/InsetView';

const plotMargin = 4;
const plotMarginX2 = plotMargin * 2;

interface Props {
  plotDimensions: IPlotDimensions;
}

export function PlotView(props: Props) {
  const { navigate } = useNavigation();
  const { apiIsLoading, apiUrlsError, readings, readingsError, plotSettings } =
    useReadings();
  const { plotDimensions } = props;
  const { plotWidth, plotHeight } = plotDimensions;

  if (apiIsLoading) {
    return (
      <InsetView style={styles.container}>
        <Text style={styles.logContent}>Loading...</Text>
      </InsetView>
    );
  }
  if (apiUrlsError) {
    return (
      <InsetView style={styles.container}>
        <Text style={styles.message}>
          Problem loading API URLS... {String(apiUrlsError)}
        </Text>
        <Button
          color={COLORS.primary}
          onPress={() => navigate('SettingsView' as never)}
          title="Settings"
        />
      </InsetView>
    );
  }
  const logContent = readingsError ? String(readingsError) : 'Success';
  const [latestReading] = readings ?? [];
  const { Trend: trend, Value: latestValue } = latestReading ?? {};
  const readingIsOld =
    latestReading && extractDate(latestReading)?.readingIsOld;
  return (
    <InsetView style={styles.container}>
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
      <Text style={styles.logContent}>
        {logContent}
        {readingIsOld && ' Outdated Reading'}
      </Text>
    </InsetView>
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
  message: {
    fontSize: 16,
    color: COLORS.primary,
  },
  logContent: {
    fontSize: 16,
    color: COLORS.primary,
    position: 'absolute',
    bottom: plotMargin * 6,
  },
});
