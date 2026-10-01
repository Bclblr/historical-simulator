import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, GameStatusBar, Screen, SwipeDecisionCard } from '@/components';
import {
  createDecisionOption,
  getEligibleEvents,
  recordDecision,
  withGameDate,
  type DecisionOption,
  type GameSessionSnapshot,
} from '@/domain/game';
import { useGameSessionService } from '@/services';
import { getScenarioForSelection } from '@/content/scenario-catalog';

function createSimulationOptions(eventId: string): [DecisionOption, DecisionOption] {
  return [
    createDecisionOption({
      id: `${eventId}:request-review`,
      eventId,
      label: 'Ek inceleme iste',
      description: 'Dosyayı hemen ilerletmek yerine ek kurumsal değerlendirme talep et.',
      swipeDirection: 'LEFT',
    }),
    createDecisionOption({
      id: `${eventId}:forward-file`,
      eventId,
      label: 'Dosyayı ilerlet',
      description: 'Dosyayı görev zincirinde bir sonraki aşamaya ilet.',
      swipeDirection: 'RIGHT',
    }),
  ];
}

export default function GameScreen() {
  const params = useLocalSearchParams<{ sessionId?: string; era?: string; country?: string; institution?: string; role?: string }>();
  const sessions = useGameSessionService();
  const [snapshot, setSnapshot] = useState<GameSessionSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const existing = params.sessionId ? await sessions.resume(params.sessionId) : null;
        if (existing) {
          if (active) setSnapshot(existing);
          return;
        }

        if (!params.era || !params.country || !params.institution || !params.role) {
          throw new Error('Oyun oturumu başlatmak için seçim bilgileri eksik.');
        }

        const scenario = getScenarioForSelection(params.era, params.country);
        if (!scenario) throw new Error('Seçilen dönem ve devlet için yayımlanmış senaryo bulunamadı.');

        const created = await sessions.start({
          sessionId: `session-${Date.now()}`,
          startDate: scenario.startDate,
          selection: {
            eraId: params.era,
            countryId: params.country,
            institutionId: params.institution,
            roleId: params.role,
          },
        });

        if (active) setSnapshot(created);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Oyun kaydı yüklenemedi.');
      }
    }

    void load();
    const scenario = snapshot
    ? getScenarioForSelection(snapshot.state.selection.eraId, snapshot.state.selection.countryId)
    : null;
  const role = scenario?.roles.find((item) => item.id === snapshot?.state.selection.roleId);
  const actorLabel = role?.shortName ?? role?.name ?? 'Kamu görevlisi';

  return (
    <Screen>
      <Stack.Screen options={{ title: '1933 · Almanya', headerShown: true }} />
      {error ? <AppCard><AppText>{error}</AppText></AppCard> : null}
      {snapshot ? (
        <View style={styles.game}>
          <GameStatusBar snapshot={snapshot} />
          {activeContent ? (
            <SwipeDecisionCard
              event={activeContent.event}
              leftOption={activeContent.options[0]}
              rightOption={activeContent.options[1]}
              actorLabel={actorLabel}
              disabled={saving}
              onChoose={(option) => void choose(option)}
            />
          ) : (
            <AppCard>
              <AppText variant="heading">Dönem tamamlandı</AppText>
              <AppText muted>Bu oturumda oynanabilir yeni tarihsel olay kalmadı.</AppText>
            </AppCard>
          )}
          <View style={styles.bottomMeta}>
            <AppText variant="caption" muted>{snapshot.state.currentDate}</AppText>
            <AppText variant="caption" muted>{snapshot.decisionHistory.length} karar</AppText>
          </View>
        </View>
      ) : (
        <AppText muted>Oturum hazırlanıyor…</AppText>
      )}
    </Screen>
  );
}


const styles = StyleSheet.create({
  game: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  bottomMeta: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
});
