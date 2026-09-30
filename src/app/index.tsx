import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>HISTORICAL SIMULATOR</Text>
      <Text style={styles.title}>Tarihi yalnızca okuma. Kararların sonuçlarını incele.</Text>
      <Text style={styles.description}>
        Akademik kaynaklara dayalı, çok devletli ve çok kurumlu tarih simülasyonu.
      </Text>
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>PROTOTİP</Text>
        <Text style={styles.statusValue}>1933 · Almanya</Text>
        <Text style={styles.statusNote}>Oyun motoru ülke ve dönemden bağımsız geliştiriliyor.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: '#F1EBDD',
  },
  eyebrow: {
    marginBottom: 12,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: '#6B6254',
  },
  title: {
    maxWidth: 520,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: '#211E19',
  },
  description: {
    maxWidth: 520,
    marginTop: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#625B50',
  },
  statusCard: {
    maxWidth: 520,
    marginTop: 36,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C9BEAA',
    backgroundColor: '#E8DFCE',
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: '#776B59',
  },
  statusValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: '#211E19',
  },
  statusNote: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#625B50',
  },
});
