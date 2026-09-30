import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>HISTORICAL SIMULATOR</Text>
      <Text style={styles.title}>Tarihi yalnızca okuma. Kararların sonuçlarını incele.</Text>
      <Text style={styles.description}>
        Akademik kaynaklara dayalı, çok devletli ve çok kurumlu tarih simülasyonu.
      </Text>

      <View style={styles.actions}>
        <Link href="/setup/era" asChild>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Yeni Oyun</Text>
          </Pressable>
        </Link>

        <Link href="/archive" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Arşiv</Text>
          </Pressable>
        </Link>

        <Link href="/settings" asChild>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Ayarlar</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 28, backgroundColor: '#F1EBDD' },
  eyebrow: { marginBottom: 12, fontSize: 12, fontWeight: '700', letterSpacing: 2.4, color: '#6B6254' },
  title: { maxWidth: 520, fontSize: 34, lineHeight: 40, fontWeight: '800', color: '#211E19' },
  description: { maxWidth: 520, marginTop: 16, fontSize: 16, lineHeight: 24, color: '#625B50' },
  actions: { maxWidth: 520, marginTop: 36, gap: 12 },
  primaryButton: { minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, backgroundColor: '#211E19' },
  primaryButtonText: { fontSize: 16, fontWeight: '700', color: '#F7F1E5' },
  secondaryButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, borderWidth: 1, borderColor: '#C9BEAA' },
  secondaryButtonText: { fontSize: 15, fontWeight: '600', color: '#3E382F' },
});
