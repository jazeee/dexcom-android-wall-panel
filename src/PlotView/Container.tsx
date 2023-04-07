import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PlotView } from './PlotView';
import { IPlotDimensions } from './types';

export function PlotViewContainer() {
  const [plotDimensions, setPlotDimensions] = useState<IPlotDimensions>({
    plotWidth: 0,
    plotHeight: 0,
  });
  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setPlotDimensions({ plotWidth: width, plotHeight: height });
      }}>
      <PlotView plotDimensions={plotDimensions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  text: {
    color: '#666',
  },
});
