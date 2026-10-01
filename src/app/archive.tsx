import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
import { getScenarioForSelection } from '@/content/scenario-catalog';
import { createPlayerArchive, getDiscoveredEvents, type GameSessionSnapshot } from '@/domain/game';
import { useGameSessionService } from '@/services';

export default function ArchiveScreen() {
  const sessions = useGameSessionService();
  const [snapshot, setSnapshot] = useState<GameSessionSnapshot | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void sessions.resumeMostRecent().then((value) => {
        if (active) setSnapshot(value);
      });
      return () => {
        active = false;
      };
    }, [sessions]),
  );

  const scenario = snapshot
    ? getScenarioForSelection(
        snapshot.state.selection.eraId,
        snapshot.state.selection.countryId,
      )
    : null;
  const events = scenario && snapshot
    ? getDiscoveredEvents(snapshot, scenario.events)
    : [];
  const archive = scenario && snapshot
    ? createPlayerArchive(snapshot, scenario.events)
    : null;

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Arşiv', headerShown: true }} />
      <SectionHeader
        eyebrow="OYUNCU ARŞİVİ"
        title="Keşfedilen kayıtlar"
        description="Arşiv yalnızca oturumun ulaştığı tarih ve gerçekten kaydedilmiş kararlar üzerinden açılır."
      />

      {!snapshot || !archive ? (
        <AppCard style={styles.card}>
          <AppText variant="heading">Henüz arşiv kaydı yok</AppText>
          <AppText muted style={styles.text}>
            Bir simülasyon başlatıldığında keşfedilen olaylar burada görünür.
          </AppText>
        </AppCard>
      ) : (
        <>
          <View style={styles.stats}>
            <AppCard style={styles.stat}>
              <AppText variant="label" muted>KEŞFEDİLEN OLAY</AppText>
              <AppText variant="title">{archive.discoveredEventIds.length}</AppText>
            </AppCard>
            <AppCard style={styles.stat}>
              <AppText variant="label" muted>KAYITLI KARAR</AppText>
              <AppText variant="title">{archive.decisionsRecorded}</AppText>
            </AppCard>
          </View>

          <View style={styles.list}>
            {events.map((event) => (
              <AppCard key={event.id}>
                <View style={styles.eventHeader}>
                  <AppText variant="label" muted>{event.startDate}</AppText>
                  <AppText variant="label" muted>TARİHSEL KAYIT</AppText>
                </View>
                <AppText variant="heading" style={styles.eventTitle}>
                  {event.title}
                </AppText>
                <AppText muted style={styles.text}>{event.summary}</AppText>
              </AppCard>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 28 },
  text: { marginTop: 8 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 28 },
  stat: { flexGrow: 1, flexBasis: 180, gap: 8 },
  list: { marginTop: 18, gap: 12 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  eventTitle: { marginTop: 10 },
});
