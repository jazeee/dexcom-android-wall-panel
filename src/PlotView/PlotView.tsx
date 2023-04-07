import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../common/colors';
import { extractDate } from './utils';
import { GlucoseGraph } from './components/GlucoseGraph';
import { Overlay } from './components/Overlay';
import { useNavigation } from '@react-navigation/native';
import { useReadings } from './useReadings';

const plotMargin = 4;
const plotMarginX2 = plotMargin * 2;

interface IPlotDimensions {
  plotWidth: number;
  plotHeight: number;
}

export function PlotView() {
  const { navigate } = useNavigation();
  const { apiIsLoading, apiUrlsError, readings, readingsError, plotSettings } =
    useReadings();
  const [plotDimensions, setPlotDimensions] = useState<IPlotDimensions>({
    plotWidth: 0,
    plotHeight: 0,
  });
  const { plotWidth, plotHeight } = plotDimensions;

  if (apiIsLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.logContent}>Loading...</Text>
      </View>
    );
  }
  if (apiUrlsError) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Problem loading API URLS... {String(apiUrlsError)}
        </Text>
        <Button
          color={COLORS.primary}
          onPress={() => navigate('SettingsView' as never)}
          title="Settings"
        />
      </View>
    );
  }
  const logContent = readingsError ? String(readingsError) : 'Success';
  const [latestReading] = readings ?? [];
  const { Trend: trend, Value: latestValue } = latestReading ?? {};
  const readingIsOld =
    latestReading && extractDate(latestReading)?.readingIsOld;
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setPlotDimensions({ plotWidth: width, plotHeight: height });
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
      <Text style={styles.logContent}>
        {logContent}
        {readingIsOld && ' Outdated Reading'}
      </Text>
    </View>
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
