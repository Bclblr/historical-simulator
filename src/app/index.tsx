import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';

export default function HomeScreen() {
  const theme = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.eyebrow, { color: theme.colors.textSubtle }]}>HISTORICAL SIMULATOR</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Tarihi yalnızca okuma. Kararların sonuçlarını incele.
      </Text>
      <Text style={[styles.description, { color: theme.colors.textMuted }]}>
        Akademik kaynaklara dayalı, çok devletli ve çok kurumlu tarih simülasyonu.
      </Text>

      <View style={styles.actions}>
        <Link href="/setup/era" asChild>
          <Pressable style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}>
            <Text style={[styles.primaryButtonText, { color: theme.colors.onPrimary }]}>Yeni Oyun</Text>
          </Pressable>
        </Link>
        <Link href="/archive" asChild>
          <Pressable style={[styles.secondaryButton, { borderColor: theme.colors.border }]}>
            <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>Arşiv</Text>
          </Pressable>
        </Link>
        <Link href="/settings" asChild>
          <Pressable style={[styles.secondaryButton, { borderColor: theme.colors.border }]}>
            <Text style={[styles.secondaryButtonText, { color: theme.colors.text }]}>Ayarlar</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28 },
  eyebrow: { marginBottom: 12, fontSize: 12, fontWeight: '700', letterSpacing: 2.4 },
  title: { maxWidth: 520, fontSize: 34, lineHeight: 40, fontWeight: '800' },
  description: { maxWidth: 520, marginTop: 16, fontSize: 16, lineHeight: 24 },
  actions: { maxWidth: 520, marginTop: 36, gap: 12 },
  primaryButton: { minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primaryButtonText: { fontSize: 16, fontWeight: '700' },
  secondaryButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, borderWidth: 1 },
  secondaryButtonText: { fontSize: 15, fontWeight: '600' },
});
