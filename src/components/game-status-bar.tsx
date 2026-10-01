import { StyleSheet, View } from 'react-native';
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
    if (effect.type === 'CHANGE_VARIABLE' && effect.key === key) return total + effect.delta;
    return total;
  }, 0);
}

export function GameStatusBar({ snapshot, previewEffects = [] }: GameStatusBarProps) {
  const theme = useAppTheme();
  const v = snapshot.state.variables;
  const items = [
    ['KAMU', 'publicSupport', v.publicSupport ?? 55],
    ['KURUM', 'institutionalInfluence', v.institutionalInfluence ?? 55],
    ['DÜZEN', 'stability', v.stability ?? 50],
    ['DIŞ', 'foreignRelations', v.foreignRelations ?? 50],
  ] as const;

  return (
    <View style={styles.root}>
      {items.map(([label, key, rawValue]) => {
        const value = clamp(rawValue);
        const delta = previewDelta(previewEffects, key);
        const previewValue = clamp(value + delta);
        const changing = delta !== 0;
        const fillColor = changing
          ? delta > 0 ? '#2EAD62' : '#D94B4B'
          : theme.colors.accent;

        return (
          <View key={label} style={styles.item}>
            <AppText variant="caption" style={{ color: theme.colors.text, textAlign: 'center' }}>
              {label}{changing ? (delta > 0 ? ' ↑' : ' ↓') : ''}
            </AppText>
            <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${changing ? previewValue : value}%`,
                    backgroundColor: fillColor,
                  },
                ]}
              />
            </View>
          </View>
        );
      })}
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
    paddingVertical: 8,
  },
  item: { flex: 1, gap: 6 },
  track: {
    width: '100%',
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
