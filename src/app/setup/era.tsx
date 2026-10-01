import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
import { getPublishedEras } from '@/content/scenario-catalog';

export default function EraScreen() {
  const eras = getPublishedEras();

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Dönem Seçimi' }} />
      <SectionHeader
        eyebrow="1 / 4"
        title="Bir dönem seç"
        description="Her dönem kendi tarihsel içerik paketini kullanır; çekirdek oyun motoru dönemden bağımsızdır."
      />
      <View style={styles.list}>
        {eras.map((era) => (
          <Link
            key={era.id}
            href={{ pathname: '/setup/country', params: { era: era.id } }}
            asChild
          >
            <AppCard interactive>
              <AppText variant="heading">{era.name}</AppText>
              <AppText muted style={styles.text}>
                {era.description}
              </AppText>
              <AppText variant="label" muted style={styles.meta}>
                {era.startDate} — {era.endDate}
              </AppText>
            </AppCard>
          </Link>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 28, gap: 12 },
  text: { marginTop: 8 },
  meta: { marginTop: 14 },
});
