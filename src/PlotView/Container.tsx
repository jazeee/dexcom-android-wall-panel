import React from 'react';
import PlotView from './PlotView';
import PlotViewHeaderButtons from './Header';
import { ViewContainer } from '../UserSettings/Container';

export function PlotViewContainer() {
  return (
    <ViewContainer header={<PlotViewHeaderButtons />}>
      <PlotView />
    </ViewContainer>
  );
}

export default PlotViewContainer;
