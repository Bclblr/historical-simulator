import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, GameStatusBar, Screen, SwipeDecisionCard } from '@/components';
import {
  applyDecisionEffects,
  evaluateGermanyCampaignEnding,
  createDecisionOption,
  getEligibleEvents,
  recordDecision,
  processDueDecisionEffects,
  scheduleDecisionEffect,
  withGameDate,
  type DecisionOption,
  type GameSessionSnapshot,
} from '@/domain/game';
import { getScenarioForSelection } from '@/content/scenario-catalog';
import { getGermany1933DecisionContent, getGermany1933FollowUpDecisionContent, type ScenarioDecisionChoice } from '@/content/germany-1933/decisions';
import { createGermany1933FollowUp } from '@/content/germany-1933/follow-ups';
import { getGermany1933DelayedConsequence } from '@/content/germany-1933/consequences';
import { useGameSessionService } from '@/services';

function createSimulationOptions(
  eventId: string,
  left: ScenarioDecisionChoice,
  right: ScenarioDecisionChoice,
): [DecisionOption, DecisionOption] {
  return [
    createDecisionOption({
      id: `${eventId}:${left.idSuffix}`,
      eventId,
      label: left.label,
      description: left.description,
      swipeDirection: 'LEFT',
    }),
    createDecisionOption({
      id: `${eventId}:${right.idSuffix}`,
      eventId,
      label: right.label,
      description: right.description,
      swipeDirection: 'RIGHT',
    }),
  ];
}

export default function GameScreen() {
  const params = useLocalSearchParams<{
    sessionId?: string;
    era?: string;
    country?: string;
    institution?: string;
    role?: string;
    playerName?: string;
  }>();
  const sessions = useGameSessionService();
  const [snapshot, setSnapshot] = useState<GameSessionSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [decisionResult, setDecisionResult] = useState<{ text: string; next: GameSessionSnapshot } | null>(null);

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
        if (!scenario) {
          throw new Error('Seçilen dönem ve devlet için yayımlanmış senaryo bulunamadı.');
        }

        const created = await sessions.start({
          sessionId: `session-${Date.now()}`,
          startDate: params.era === 'germany-1921' ? '1921-07-29' : scenario.startDate,
          selection: {
            eraId: params.era,
            countryId: params.country,
            institutionId: params.institution,
            roleId: params.role,
          },
          campaign: params.era === 'germany-1921'
            ? {
                playerName: params.playerName?.trim() || 'Oyuncu',
                campaignId: 'germany-1921',
                startedAt: '1921-07-29',
                leadershipActive: true,
              }
            : undefined,
        });

        if (active) setSnapshot(created);
      } catch (cause) {
        if (active) {
          setError(cause instanceof Error ? cause.message : 'Oyun kaydı yüklenemedi.');
        }
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [params.country, params.era, params.institution, params.role, params.sessionId, sessions]);

  const activeContent = useMemo(() => {
    if (!snapshot) return null;
    const scenario = getScenarioForSelection(
      snapshot.state.selection.eraId,
      snapshot.state.selection.countryId,
    );
    if (!scenario) return null;

    const decidedIds = new Set(snapshot.decisionHistory.map((item) => item.eventId));
    const lastDecision = [...snapshot.decisionHistory]
      .sort((a, b) => b.sequence - a.sequence)[0];
    const lastHistoricalEvent = lastDecision
      ? scenario.events.find((item) => item.id === lastDecision.eventId)
      : null;
    const followUp = lastHistoricalEvent
      ? createGermany1933FollowUp(lastHistoricalEvent, snapshot.decisionHistory)
      : null;

    if (followUp) {
      const decision = getGermany1933FollowUpDecisionContent(followUp.event.id);
      return {
        event: followUp.event,
        decision: { ...decision, prompt: followUp.prompt, speaker: followUp.speaker },
        options: createSimulationOptions(followUp.event.id, decision.left, decision.right),
      };
    }

    const eligibleEvent = getEligibleEvents(scenario.events, snapshot.state)
      .find((item) => !decidedIds.has(item.id));
    const nextFutureEvent = [...scenario.events]
      .filter(
        (item) =>
          item.status === 'PUBLISHED' &&
          !decidedIds.has(item.id) &&
          item.startDate > snapshot.state.currentDate,
      )
      .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.sortOrder - b.sortOrder)[0];
    const event = eligibleEvent ?? nextFutureEvent;

    if (!event) return null;
    const decision = getGermany1933DecisionContent(event.id);
    return {
      event,
      decision,
      options: createSimulationOptions(event.id, decision.left, decision.right),
    };
  }, [snapshot]);

  const scenario = snapshot
    ? getScenarioForSelection(snapshot.state.selection.eraId, snapshot.state.selection.countryId)
    : null;
  const role = scenario?.roles.find((item) => item.id === snapshot?.state.selection.roleId);
  const actorLabel = snapshot?.campaign?.playerName ?? role?.shortName ?? role?.name ?? 'Kamu görevlisi';
  const ending = snapshot ? evaluateGermanyCampaignEnding(snapshot) : null;

  async function choose(option: DecisionOption) {
    if (!snapshot || !activeContent || saving) return;
    setSaving(true);
    setError(null);

    try {
      const currentScenario = getScenarioForSelection(
        snapshot.state.selection.eraId,
        snapshot.state.selection.countryId,
      );
      if (!currentScenario) throw new Error('Senaryo bulunamadı.');

      const history = recordDecision(snapshot.decisionHistory, {
        option,
        decidedAt: snapshot.state.currentDate,
      });
      const decidedIds = new Set(history.map((item) => item.eventId));
      const isFollowUp = activeContent.event.classification === 'COUNTERFACTUAL_SIMULATION';
      const nextEvent = isFollowUp
        ? [...currentScenario.events]
            .filter((event) => !decidedIds.has(event.id) && event.startDate >= snapshot.state.currentDate)
            .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.sortOrder - b.sortOrder)[0]
        : undefined;

      const selectedChoice =
        option.swipeDirection === 'LEFT'
          ? activeContent.decision.left
          : activeContent.decision.right;
      const stateAtEventDate =
        activeContent.event.startDate > snapshot.state.currentDate
          ? withGameDate(snapshot.state, activeContent.event.startDate)
          : snapshot.state;
      const affectedState = applyDecisionEffects(stateAtEventDate, selectedChoice.effects);
      const delayed = activeContent.event.classification === 'COUNTERFACTUAL_SIMULATION'
        ? null
        : getGermany1933DelayedConsequence(
            activeContent.event.id,
            selectedChoice.idSuffix,
          );
      const scheduledEffects = delayed
        ? scheduleDecisionEffect(snapshot.scheduledEffects, affectedState, {
            id: delayed.idSuffix,
            delayDays: delayed.delayDays,
            effects: delayed.effects,
          })
        : snapshot.scheduledEffects;

      const datedState = nextEvent
        ? withGameDate(affectedState, nextEvent.startDate)
        : affectedState;
      const processed = processDueDecisionEffects(datedState, scheduledEffects);
      const next: GameSessionSnapshot = {
        ...snapshot,
        state: processed.state,
        decisionHistory: history,
        scheduledEffects: processed.pending,
      };

      await sessions.save(next);
      setDecisionResult({ text: selectedChoice.result, next });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Karar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: snapshot?.campaign ? 'Almanya · Kesintisiz Kampanya' : '1933 · Almanya', headerShown: true, gestureEnabled: false }} />
      {error ? <AppCard><AppText>{error}</AppText></AppCard> : null}
      {snapshot ? (
        <View style={styles.game}>
          <GameStatusBar snapshot={decisionResult?.next ?? snapshot} />
          {ending && !decisionResult ? (
            <AppCard>
              <AppText variant="label" muted>ZAMAN ÇİZGİSİ SONA ERDİ</AppText>
              <AppText variant="heading">{ending.title}</AppText>
              <AppText>{ending.description}</AppText>
              <AppText muted>
                {ending.classification === 'HISTORICAL_FACT' ? 'Tarihsel sınır' : 'Alternatif Simülasyon'}
              </AppText>
              <AppText variant="caption" muted>
                {snapshot.campaign?.playerName ?? 'Oyuncu'} · {snapshot.state.currentDate} · {snapshot.decisionHistory.length} karar
              </AppText>
            </AppCard>
          ) : decisionResult ? (
            <AppCard>
              <AppText variant="label" muted>KARAR SONUCU</AppText>
              <AppText variant="heading">{decisionResult.text}</AppText>
              <AppText muted>Kararın etkileri göstergelere işlendi.</AppText>
              <AppText
                variant="label"
                onPress={() => {
                  setSnapshot(decisionResult.next);
                  setDecisionResult(null);
                }}
              >
                SONRAKİ KART →
              </AppText>
            </AppCard>
          ) : activeContent ? (
            <SwipeDecisionCard
              event={activeContent.event}
              leftOption={activeContent.options[0]}
              rightOption={activeContent.options[1]}
              actorLabel={activeContent.decision.speaker || actorLabel}
              prompt={activeContent.decision.prompt}
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
