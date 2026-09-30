import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { AppText } from './app-text';
import { useAppTheme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface AppButtonProps extends PressableProps {
  variant?: ButtonVariant;
}

export function AppButton({ variant = 'primary', style, children, disabled, ...props }: PropsWithChildren<AppButtonProps>) {
  const theme = useAppTheme();

  const variantStyle: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }
      : variant === 'secondary'
        ? { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
        : { backgroundColor: 'transparent', borderColor: theme.colors.border };

  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variantStyle,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        typeof style === 'function' ? style({ pressed }) : style,
      ]}
    >
      <AppText
        style={{ color: variant === 'primary' ? theme.colors.onPrimary : theme.colors.text }}
        variant="body"
      >
        {children}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
});
