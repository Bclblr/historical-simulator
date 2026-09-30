import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
import { useAppTheme } from '@/theme';

export type AppTextVariant = 'display' | 'title' | 'heading' | 'body' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  muted?: boolean;
}

export function AppText({ variant = 'body', muted = false, style, children, ...props }: PropsWithChildren<AppTextProps>) {
  const theme = useAppTheme();
  const variantStyle: TextStyle =
    variant === 'label'
      ? styles.label
      : theme.typography[variant];

  return (
    <Text
      {...props}
      style={[
        variantStyle,
        { color: muted ? theme.colors.textMuted : theme.colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
});
