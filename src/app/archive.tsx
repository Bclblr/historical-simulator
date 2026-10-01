import { Stack, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
import { getScenarioForSelection } from '@/content/scenario-catalog';
import {
  createArchiveTimeline,
  createPlayerArchive,
  getDecisionHistory,
  getDiscoveredDocuments,
  getDiscoveredEvents,
  type GameSessionSnapshot,
} from '@/domain/game';
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
      return () => { active = false; };
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
  const documents = scenario && snapshot
    ? getDiscoveredDocuments(snapshot, scenario.events, scenario.documents)
    : [];
  const timeline = scenario && snapshot
    ? createArchiveTimeline(snapshot, scenario.events)
    : [];
  const decisions = snapshot ? getDecisionHistory(snapshot) : [];
  const archive = scenario && snapshot
    ? createPlayerArchive(snapshot, scenario.events, scenario.documents)
    : null;

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Arşiv', headerShown: true }} />
      <SectionHeader
        eyebrow="OYUNCU ARŞİVİ"
        title="Keşfedilen kayıtlar"
        description="Tarihsel kayıtlar ile oyuncunun karar geçmişi ayrı etiketlerle gösterilir."
      />

      {!snapshot || !archive ? (
        <AppCard style={styles.card}>
          <AppText variant="heading">Henüz arşiv kaydı yok</AppText>
          <AppText muted style={styles.text}>
            Bir simülasyon başlatıldığında keşfedilen kayıtlar burada görünür.
          </AppText>
        </AppCard>
      ) : (
        <>
          <View style={styles.stats}>
            <Stat label="KEŞFEDİLEN OLAY" value={archive.discoveredEventIds.length} />
            <Stat label="KEŞFEDİLEN BELGE" value={archive.discoveredDocumentIds.length} />
            <Stat label="KAYITLI KARAR" value={archive.decisionsRecorded} />
          </View>

          <ArchiveSection title="Zaman Çizgisi">
            {timeline.map((item) => (
              <AppCard key={item.id}>
                <View style={styles.header}>
                  <AppText variant="label" muted>{item.date}</AppText>
                  <AppText variant="label" muted>
                    {item.kind === 'EVENT' ? 'TARİHSEL KAYIT' : 'OYUNCU KARARI'}
                  </AppText>
                </View>
                <AppText variant="heading" style={styles.title}>{item.title}</AppText>
                {item.optionId ? (
                  <AppText muted style={styles.text}>Seçenek: {item.optionId}</AppText>
                ) : null}
              </AppCard>
            ))}
          </ArchiveSection>

          <ArchiveSection title="Keşfedilen Belgeler">
            {documents.length ? documents.map((document) => (
              <AppCard key={document.id}>
                <View style={styles.header}>
                  <AppText variant="label" muted>{document.documentDate ?? 'Tarihsiz'}</AppText>
                  <AppText variant="label" muted>{document.type}</AppText>
                </View>
                <AppText variant="heading" style={styles.title}>{document.title}</AppText>
                <AppText muted style={styles.text}>{document.summary}</AppText>
              </AppCard>
            )) : (
              <AppCard>
                <AppText variant="heading">Henüz yayımlanmış belge yok</AppText>
                <AppText muted style={styles.text}>
                  Kaynaklandırılmış belgeler içerik paketine eklendiğinde burada otomatik açılacak.
                </AppText>
              </AppCard>
            )}
          </ArchiveSection>

          <ArchiveSection title="Karar Geçmişi">
            {decisions.length ? decisions.map((decision) => {
              const event = scenario.events.find((item) => item.id === decision.eventId);
              return (
                <AppCard key={decision.sequence}>
                  <View style={styles.header}>
                    <AppText variant="label" muted>#{decision.sequence}</AppText>
                    <AppText variant="label" muted>{decision.decidedAt}</AppText>
                  </View>
                  <AppText variant="heading" style={styles.title}>
                    {event?.title ?? decision.eventId}
                  </AppText>
                  <AppText muted style={styles.text}>Seçenek: {decision.optionId}</AppText>
                </AppCard>
              );
            }) : (
              <AppCard><AppText muted>Henüz kayıtlı oyuncu kararı yok.</AppText></AppCard>
            )}
          </ArchiveSection>

          <ArchiveSection title="Keşfedilen Olaylar">
            {events.map((event) => (
              <AppCard key={event.id}>
                <View style={styles.header}>
                  <AppText variant="label" muted>{event.startDate}</AppText>
                  <AppText variant="label" muted>TARİHSEL KAYIT</AppText>
                </View>
                <AppText variant="heading" style={styles.title}>{event.title}</AppText>
                <AppText muted style={styles.text}>{event.summary}</AppText>
              </AppCard>
            ))}
          </ArchiveSection>
        </>
      )}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <AppCard style={styles.stat}>
      <AppText variant="label" muted>{label}</AppText>
      <AppText variant="title">{value}</AppText>
    </AppCard>
  );
}

function ArchiveSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="title">{title}</AppText>
      <View style={styles.list}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 28 },
  text: { marginTop: 8 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 28 },
  stat: { flexGrow: 1, flexBasis: 150, gap: 8 },
  section: { marginTop: 30 },
  list: { marginTop: 14, gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  title: { marginTop: 10 },
});
