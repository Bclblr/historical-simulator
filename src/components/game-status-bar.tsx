import { StyleSheet, View } from 'react-native';
import type { GameSessionSnapshot } from '@/domain/game';
import { useAppTheme } from '@/theme';
import { AppText } from './app-text';

interface GameStatusBarProps {
  snapshot: GameSessionSnapshot;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function GameStatusBar({ snapshot }: GameStatusBarProps) {
  const theme = useAppTheme();
  const v = snapshot.state.variables;
  const items = [
    ['KAMU', v.publicSupport ?? 55],
    ['KURUM', v.institutionalInfluence ?? 55],
    ['DÜZEN', v.stability ?? 50],
    ['DIŞ', v.foreignRelations ?? 50],
  ] as const;

  return (
    <View style={styles.root}>
      {items.map(([label, rawValue]) => {
        const value = clamp(rawValue);
        return (
          <View key={label} style={styles.item}>
            <View style={styles.labelRow}>
              <AppText variant="caption" style={{ color: theme.colors.text }}>{label}</AppText>
              <AppText variant="caption" muted>{Math.round(value)}</AppText>
            </View>
            <View style={[styles.track, { backgroundColor: theme.colors.border }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${value}%`,
                    backgroundColor: theme.colors.accent,
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  track: {
    width: '100%',
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
