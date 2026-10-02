import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import type { DecisionEffect, GameSessionSnapshot } from '@/domain/game';
import { useAppTheme } from '@/theme';
import { AppText } from './app-text';

interface GameStatusBarProps {
  snapshot: GameSessionSnapshot;
  previewEffects?: DecisionEffect[];
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function previewDelta(effects: DecisionEffect[], key: string): number {
  return effects.reduce((total, effect) => {
    if (effect.type === 'CHANGE_VARIABLE' && effect.key === key) {
      return total + Math.sign(effect.delta) * Math.max(3, Math.round(Math.abs(effect.delta) * 2.5));
    }
    return total;
  }, 0);
}

function Meter({
  label,
  value,
  delta,
  accent,
  track,
}: {
  label: string;
  value: number;
  delta: number;
  accent: string;
  track: string;
}) {
  const animatedValue = useSharedValue(clamp(value));

  useEffect(() => {
    animatedValue.value = withTiming(clamp(value), {
      duration: 380,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedValue, value]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedValue.value}%`,
  }));

  const changing = delta !== 0;
  const fillColor = changing
    ? delta > 0
      ? '#2EAD62'
      : '#D94B4B'
    : accent;

  return (
    <View style={styles.item}>
      <View style={styles.meterHeader}>
        <AppText variant="caption" style={styles.label}>
          {label}
        </AppText>
        <View style={styles.valuePlaceholder} />
      </View>
      <View style={[styles.track, { backgroundColor: track }]}>
        <Animated.View
          style={[
            styles.fill,
            animatedStyle,
            { backgroundColor: fillColor },
          ]}
        />

      </View>
    </View>
  );
}

export function GameStatusBar({ snapshot, previewEffects = [] }: GameStatusBarProps) {
  const theme = useAppTheme();
  const v = snapshot.state.variables;

  // Reigns-style: the four core meters stay visible, move smoothly after
  // every decision, and preview the next balance while the card is dragged.
  // Ottoman Mediterranean and the removed Germany-life content both use
  // the same four visible Reigns meters. The important fix is that the
  // Ottoman cards actually modify these exact variables.
  const items = ([
    ['HAZİNE', 'money', v.money ?? 50],
    ['SELAMET', 'safety', v.safety ?? 55],
    ['AĞ', 'social', v.social ?? 50],
    ['NÜFUZ', 'reputation', v.reputation ?? 50],
  ] as const);

  return (
    <View style={styles.root}>
      {items.map(([label, key, rawValue]) => (
        <Meter
          key={label}
          label={label}
          value={clamp(rawValue)}
          delta={previewDelta(previewEffects, key)}
          accent={theme.colors.accent}
          track={theme.colors.border}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    gap: 4,
  },
  meterHeader: {
    minHeight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
  },
  valuePlaceholder: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  track: {
    position: 'relative',
    width: '100%',
    height: 9,
    borderRadius: 999,
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
