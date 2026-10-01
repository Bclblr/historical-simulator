import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { AppButton, AppCard, AppText, DeskScreen, Screen } from '@/components';
import {
  createDeskFile,
  createDecisionOption,
  getEligibleEvents,
  recordDecision,
  withGameDate,
  type DecisionOption,
  type GameSessionSnapshot,
} from '@/domain/game';
import { useGameSessionService } from '@/services';
import { getScenarioForSelection } from '@/content/scenario-catalog';

function createSimulationOptions(eventId: string): DecisionOption[] {
  return [
    createDecisionOption({
      id: `${eventId}:request-briefing`,
      eventId,
      label: 'Ayrıntılı değerlendirme iste',
      description: 'Dosya hakkında ek kurumsal değerlendirme talep et.',
    }),
    createDecisionOption({
      id: `${eventId}:record-objection`,
      eventId,
      label: 'Çekinceni kayda geçir',
      description: 'Kurumsal kayda çekince ve risk notu ekle.',
    }),
    createDecisionOption({
      id: `${eventId}:forward-file`,
      eventId,
      label: 'Dosyayı üst makama ilet',
      description: 'Dosyayı karar yetkisi bulunan üst makama gönder.',
    }),
  ];
}

export default function GameScreen() {
  const params = useLocalSearchParams<{ sessionId?: string; era?: string; country?: string; institution?: string; role?: string }>();
  const sessions = useGameSessionService();
  const [snapshot, setSnapshot] = useState<GameSessionSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileOpen, setFileOpen] = useState(false);
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
    return () => { active = false; };
  }, [params.country, params.era, params.institution, params.role, params.sessionId, sessions]);

  const activeContent = useMemo(() => {
    if (!snapshot) return null;
    const scenario = getScenarioForSelection(
      snapshot.state.selection.eraId,
      snapshot.state.selection.countryId,
    );
    if (!scenario) return null;

    const decidedIds = new Set(snapshot.decisionHistory.map((item) => item.eventId));
    const event = getEligibleEvents(scenario.events, snapshot.state)
      .find((item) => !decidedIds.has(item.id));
    if (!event) return null;

    return {
      event,
      options: createSimulationOptions(event.id),
      file: createDeskFile({
        id: `desk-file:${event.id}`,
        eventId: event.id,
        title: event.title,
        documentIds: scenario.documents
          .filter((document) => document.eventIds.includes(event.id))
          .map((document) => document.id),
        status: 'OPEN',
        priority: 100,
      }),
    };
  }, [snapshot]);

  async function choose(option: DecisionOption) {
    if (!snapshot || !activeContent || saving) return;
    setSaving(true);
    setError(null);
    try {
      const scenario = getScenarioForSelection(
        snapshot.state.selection.eraId,
        snapshot.state.selection.countryId,
      );
      if (!scenario) throw new Error('Senaryo bulunamadı.');

      const history = recordDecision(snapshot.decisionHistory, {
        option,
        decidedAt: snapshot.state.currentDate,
      });
      const decidedIds = new Set(history.map((item) => item.eventId));
      const nextEvent = [...scenario.events]
        .filter((event) => !decidedIds.has(event.id) && event.startDate > snapshot.state.currentDate)
        .sort((a, b) => a.startDate.localeCompare(b.startDate) || a.sortOrder - b.sortOrder)[0];

      const next: GameSessionSnapshot = {
        ...snapshot,
        state: nextEvent ? withGameDate(snapshot.state, nextEvent.startDate) : snapshot.state,
        decisionHistory: history,
      };
      await sessions.save(next);
      setSnapshot(next);
      setFileOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Karar kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Simülasyon', headerShown: true }} />
      <AppText variant="label" muted>{error ? 'HATA' : snapshot ? 'OTURUM KAYDEDİLDİ' : 'OTURUM HAZIRLANIYOR'}</AppText>
      {error ? <AppCard><AppText>{error}</AppText></AppCard> : null}
      {snapshot ? (
        <>
          <DeskScreen
            state={snapshot.state}
            activeFile={activeContent?.file ?? null}
            onOpenFile={() => setFileOpen(true)}
          />
          {activeContent && fileOpen ? (
            <>
              <AppCard>
                <AppText variant="label" muted>{activeContent.event.startDate} · TARİHSEL KAYIT</AppText>
                <AppText variant="title">{activeContent.event.title}</AppText>
                <AppText>{activeContent.event.summary}</AppText>
              </AppCard>

              <AppCard>
                <AppText variant="label" muted>KARŞI-OLGUSAL SİMÜLASYON</AppText>
                <AppText variant="heading">Karar Simülasyonu</AppText>
                <AppText muted>
                  Aşağıdaki seçenekler tarihsel gerçek değildir. Seçtiğin görev çerçevesinde oyunun alternatif karar katmanıdır.
                </AppText>
                {activeContent.options.map((option) => (
                  <AppButton
                    key={option.id}
                    variant="secondary"
                    disabled={saving}
                    onPress={() => void choose(option)}
                  >
                    {option.label}
                  </AppButton>
                ))}
              </AppCard>
            </>
          ) : !activeContent ? (
            <AppCard>
              <AppText variant="heading">Bu tarihte bekleyen dosya yok</AppText>
              <AppText muted>Yayımlanmış ve koşulları karşılayan yeni olay bulunamadı.</AppText>
            </AppCard>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}
