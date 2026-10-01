import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppCard, AppText, CampaignEndingCard, GameStatusBar, Screen, SwipeDecisionCard } from '@/components';
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
import { getGermany1933DecisionContent, type ScenarioDecisionChoice } from '@/content/germany-1933/decisions';
import { getGermany1933DelayedConsequence } from '@/content/germany-1933/consequences';
import { getGermanyCampaignBranchEvents, getGermanyCampaignExcludedEventIds, getGermanyCareerEvents } from '@/content/germany-campaign';
import { getActiveGermanyLifeCard, type LifeChoice } from '@/content/germany-life/deck';
import { useGameSessionService } from '@/services';

function createSimulationOptions(
  eventId: string,
  left: Pick<ScenarioDecisionChoice, 'idSuffix' | 'label' | 'description' | 'effects'> | LifeChoice,
  right: Pick<ScenarioDecisionChoice, 'idSuffix' | 'label' | 'description' | 'effects'> | LifeChoice,
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

function campaignCardScore(eventId: string, historyKey: string): number {
  let hash = 2166136261;
  const input = `${historyKey}|${eventId}`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const weight = eventId.startsWith('career-') ? 4 : eventId.startsWith('alt-') ? 5 : 2;
  return (hash >>> 0) / weight;
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
  const [previewDirection, setPreviewDirection] = useState<'LEFT' | 'RIGHT' | null>(null);

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
          startDate: params.era === 'germany-1921' ? '1933-01-30' : scenario.startDate,
          selection: {
            eraId: params.era,
            countryId: params.country,
            institutionId: params.institution,
            roleId: params.role,
          },
          campaign: params.era === 'germany-1921'
            ? {
                playerName: params.playerName?.trim() || 'Oyuncu',
                campaignId: 'germany-life',
                startedAt: '1933-01-30',
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

    if (snapshot.campaign?.campaignId === 'germany-life') {
      const life = getActiveGermanyLifeCard(snapshot);
      return {
        event: life.event,
        decision: {
          prompt: life.card.line,
          speaker: life.card.speaker,
          role: life.card.role,
          left: life.card.left,
          right: life.card.right,
        },
        options: createSimulationOptions(life.event.id, life.card.left, life.card.right),
        lifeCard: life.card,
      };
    }
    const scenario = getScenarioForSelection(
      snapshot.state.selection.eraId,
      snapshot.state.selection.countryId,
    );
    if (!scenario) return null;

    const decidedIds = new Set(snapshot.decisionHistory.map((item) => item.eventId));
    const excludedIds = getGermanyCampaignExcludedEventIds(snapshot.decisionHistory);
    const campaignEvents = [...scenario.events, ...getGermanyCareerEvents(snapshot.decisionHistory), ...getGermanyCampaignBranchEvents(snapshot.decisionHistory)]
      .filter((event) => !excludedIds.has(event.id));
    const eligibleEvents = getEligibleEvents(campaignEvents, snapshot.state)
      .filter((item) => !decidedIds.has(item.id));
    const historyKey = snapshot.decisionHistory.map((item) => item.optionId).join('|');
    const eligibleEvent = eligibleEvents.length
      ? [...eligibleEvents].sort(
          (a, b) => campaignCardScore(a.id, historyKey) - campaignCardScore(b.id, historyKey),
        )[0]
      : undefined;
    const nextFutureEvent = [...campaignEvents]
      .filter(
        (item) =>
          item.status === 'PUBLISHED' &&
          !decidedIds.has(item.id) &&
          item.startDate > snapshot.state.currentDate,
      )
      .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.sortOrder - b.sortOrder)[0];
    const event = eligibleEvent ?? nextFutureEvent;

    if (!event) return null;
    const decision = getGermany1933DecisionContent(event.id, event.title, event.summary);
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

    const previousSnapshot = snapshot;
    let optimisticSnapshotApplied = false;

    setSaving(true);
    setError(null);

    try {
      if (snapshot.campaign?.campaignId === 'germany-life') {
        const selectedChoice =
          option.swipeDirection === 'LEFT'
            ? activeContent.decision.left
            : activeContent.decision.right;

        const history = recordDecision(snapshot.decisionHistory, {
          option,
          decidedAt: snapshot.state.currentDate,
        });

        const affectedState = applyDecisionEffects(
          snapshot.state,
          selectedChoice.effects,
        );

        const processed = processDueDecisionEffects(
          affectedState,
          snapshot.scheduledEffects,
        );

        const next: GameSessionSnapshot = {
          ...snapshot,
          state: processed.state,
          decisionHistory: history,
          scheduledEffects: processed.pending,
        };

        setSnapshot(next);
        optimisticSnapshotApplied = true;
        await sessions.save(next);
        return;
      }
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
      const excludedIds = getGermanyCampaignExcludedEventIds(history);
      const campaignEvents = [...currentScenario.events, ...getGermanyCareerEvents(history), ...getGermanyCampaignBranchEvents(history)]
        .filter((event) => !excludedIds.has(event.id));
      const nextEvent = [...campaignEvents]
        .filter((event) => !decidedIds.has(event.id) && event.startDate >= activeContent.event.startDate)
        .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.sortOrder - b.sortOrder)[0];

      const selectedChoice =
        option.swipeDirection === 'LEFT'
          ? activeContent.decision.left
          : activeContent.decision.right;
      const stateAtEventDate =
        activeContent.event.startDate > snapshot.state.currentDate
          ? withGameDate(snapshot.state, activeContent.event.startDate)
          : snapshot.state;
      const affectedState = applyDecisionEffects(stateAtEventDate, selectedChoice.effects);
      const delayed = getGermany1933DelayedConsequence(
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

      // Reigns-style loop: the next card appears immediately after the outgoing
      // card finishes its throw. Persistence continues without holding the old
      // card on screen.
      setSnapshot(next);
      optimisticSnapshotApplied = true;
      await sessions.save(next);
    } catch (cause) {
      if (optimisticSnapshotApplied) {
        setSnapshot(previousSnapshot);
      }
      setError(cause instanceof Error ? cause.message : 'Karar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  async function restartCampaign() {
    if (!snapshot || saving) return;

    setSaving(true);
    setError(null);
    setPreviewDirection(null);

    try {
      const restartScenario = getScenarioForSelection(
        snapshot.state.selection.eraId,
        snapshot.state.selection.countryId,
      );

      if (!restartScenario) {
        throw new Error('Senaryo bulunamadı.');
      }

      const restarted = await sessions.start({
        sessionId: `session-${Date.now()}`,
        startDate:
          snapshot.state.selection.eraId === 'germany-1921'
            ? '1933-01-30'
            : restartScenario.startDate,
        selection: snapshot.state.selection,
        campaign:
          snapshot.state.selection.eraId === 'germany-1921'
            ? {
                playerName: snapshot.campaign?.playerName ?? 'Oyuncu',
                campaignId: 'germany-life',
                startedAt: '1933-01-30',
                leadershipActive: true,
              }
            : undefined,
      });

      setSnapshot(restarted);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Oyun yeniden başlatılamadı.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <Stack.Screen options={{ title: snapshot?.campaign?.campaignId === 'germany-life' ? 'Almanya · Bir Hayat' : snapshot?.campaign ? 'Almanya · Kesintisiz Kampanya' : '1933 · Almanya', headerShown: true, gestureEnabled: false }} />
      {error ? <AppCard><AppText>{error}</AppText></AppCard> : null}
      {snapshot ? (
        <View style={styles.game}>
          <GameStatusBar
            snapshot={snapshot}
            previewEffects={
              previewDirection && activeContent
                ? (previewDirection === 'LEFT'
                    ? activeContent.decision.left.effects
                    : activeContent.decision.right.effects)
                : []
            }
          />
          <View style={styles.decisionArea}>
          {ending ? (
            <CampaignEndingCard
              ending={ending}
              playerName={snapshot.campaign?.playerName ?? 'Oyuncu'}
              date={snapshot.state.currentDate}
              decisionCount={snapshot.decisionHistory.length}
              restarting={saving}
              onRestart={() => void restartCampaign()}
            />
          ) : activeContent ? (
            <SwipeDecisionCard
              key={`${activeContent.event.id}:${snapshot.decisionHistory.length}`}
              event={activeContent.event}
              leftOption={activeContent.options[0]}
              rightOption={activeContent.options[1]}
              actorLabel={activeContent.decision.speaker || actorLabel}
              conversationOverride={
                snapshot.campaign?.campaignId === 'germany-life'
                  ? {
                      speaker: activeContent.decision.speaker,
                      role: activeContent.decision.role,
                      line: activeContent.decision.prompt,
                    }
                  : undefined
              }
              disabled={saving}
              onPreviewDirection={setPreviewDirection}
              onChoose={(option) => void choose(option)}
            />
          ) : (
            <AppCard>
              <AppText variant="heading">Dönem tamamlandı</AppText>
              <AppText muted>Bu oturumda oynanabilir yeni tarihsel olay kalmadı.</AppText>
            </AppCard>
          )}
          </View>
        </View>
      ) : (
        <AppText muted>Oturum hazırlanıyor…</AppText>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
  },
  game: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  decisionArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 24,
  },
});
