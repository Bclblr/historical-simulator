import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/theme';

interface ScreenProps {
  scroll?: boolean;
  centered?: boolean;
  style?: ViewStyle;
}

export function Screen({ children, scroll = false, centered = false, style }: PropsWithChildren<ScreenProps>) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const contentStyle = [
    styles.content,
    centered && styles.centered,
    { paddingTop: Math.max(insets.top, 24), paddingBottom: Math.max(insets.bottom, 24) },
    style,
  ];

  if (scroll) {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={contentStyle}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[{ flex: 1, backgroundColor: theme.colors.background }, contentStyle]}>{children}</View>;
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 24 },
  centered: { justifyContent: 'center' },
});
