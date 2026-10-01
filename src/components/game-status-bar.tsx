import { StyleSheet, View } from 'react-native';
import type { GameSessionSnapshot } from '@/domain/game';
import { useAppTheme } from '@/theme';
import { AppText } from './app-text';

interface GameStatusBarProps {
  snapshot: GameSessionSnapshot;
}

function meter(value: number): string {
  const clamped = Math.max(0, Math.min(100, value));
  const filled = Math.round(clamped / 20);
  return `${'●'.repeat(filled)}${'○'.repeat(5 - filled)}`;
}

export function GameStatusBar({ snapshot }: GameStatusBarProps) {
  const theme = useAppTheme();
  const v = snapshot.state.variables;
  const items = [
    ['KAMU', v.publicSupport ?? 50],
    ['KURUM', v.institutionalInfluence ?? 50],
    ['DÜZEN', v.stability ?? 50],
    ['DIŞ', v.foreignRelations ?? 50],
  ] as const;

  return (
    <View style={styles.root}>
      {items.map(([label, value]) => (
        <View key={label} style={styles.item}>
          <AppText variant="label" style={{ color: theme.colors.text }}>{label}</AppText>
          <AppText variant="caption" style={{ color: theme.colors.accent }}>{meter(value)}</AppText>
        </View>
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
    justifyContent: 'space-between',
    gap: 6,
    paddingVertical: 8,
  },
  item: { flex: 1, alignItems: 'center', gap: 5 },
});
