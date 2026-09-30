import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from 'react-native';
import { useAppTheme } from '@/theme';

interface AppCardProps extends ViewProps {
  interactive?: false;
}

interface InteractiveAppCardProps extends PressableProps {
  interactive: true;
}

export function AppCard(props: PropsWithChildren<AppCardProps | InteractiveAppCardProps>) {
  const theme = useAppTheme();
  const sharedStyle = [styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }];

  if (props.interactive) {
    const { children, style, ...rest } = props;
    return (
      <Pressable
        {...rest}
        style={(state) => [
          sharedStyle,
          state.pressed && styles.pressed,
          typeof style === 'function' ? style(state) : style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  const { children, style, interactive: _interactive, ...rest } = props;
  return <View {...rest} style={[sharedStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { padding: 22, borderWidth: 1 },
  pressed: { opacity: 0.8 },
});
