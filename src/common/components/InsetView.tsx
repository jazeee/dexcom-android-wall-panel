import { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface InsetViewProps {
  children: ReactNode;
  style?: object;
}

export function InsetView(props: InsetViewProps) {
  const { children, style } = props;
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        ...style,
      }}>
      {children}
    </View>
  );
}
