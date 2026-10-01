import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { AppCard, AppText, DeskScreen, Screen } from '@/components';
import { createDeskFile, generateNextCard, type GameState } from '@/domain/game';
import { useGameSessionService } from '@/services';
import { getScenarioForSelection } from '@/content/scenario-catalog';

export default function GameScreen() {
  const params = useLocalSearchParams<{ sessionId?: string; era?: string; country?: string; institution?: string; role?: string }>();
  const sessions = useGameSessionService();
  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileOpen, setFileOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const existing = params.sessionId ? await sessions.resume(params.sessionId) : null;
        if (existing) {
          if (active) setState(existing.state);
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
          startDate: scenario.startDate,
          selection: {
            eraId: params.era,
            countryId: params.country,
            institutionId: params.institution,
            roleId: params.role,
          },
        });

        if (active) setState(created.state);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Oyun kaydı yüklenemedi.');
      }
    }

    void load();
    return () => { active = false; };
  }, [params.country, params.era, params.institution, params.role, params.sessionId, sessions]);

  const activeContent = useMemo(() => {
    if (!state) return null;
    const scenario = getScenarioForSelection(
      state.selection.eraId,
      state.selection.countryId,
    );
    if (!scenario) return null;

    const card = generateNextCard(scenario.events, state);
    if (!card) return null;

    return {
      card,
      file: createDeskFile({
        id: `desk-file:${card.eventId}`,
        eventId: card.eventId,
        title: card.title,
        documentIds: scenario.documents
          .filter((document) => document.eventIds.includes(card.eventId))
          .map((document) => document.id),
        status: 'OPEN',
        priority: 100,
      }),
    };
  }, [state]);

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: 'Simülasyon', headerShown: true }} />
      <AppText variant="label" muted>{error ? 'KAYIT HATASI' : state ? 'OTURUM KAYDEDİLDİ' : 'OTURUM HAZIRLANIYOR'}</AppText>
      {error ? (
        <AppCard><AppText>{error}</AppText></AppCard>
      ) : state ? (
        <>
          <DeskScreen
            state={state}
            activeFile={activeContent?.file ?? null}
            onOpenFile={() => setFileOpen(true)}
          />
          {activeContent && fileOpen ? (
            <AppCard>
              <AppText variant="label" muted>{activeContent.card.date} · TARİHSEL KAYIT</AppText>
              <AppText variant="title">{activeContent.card.title}</AppText>
              <AppText>{activeContent.card.body}</AppText>
              <AppText variant="label" muted>Bu bölüm tarihsel olay kaydıdır; karar seçenekleri ayrı simülasyon katmanında sunulacaktır.</AppText>
            </AppCard>
          ) : !activeContent ? (
            <AppCard>
              <AppText variant="heading">Bu tarihte uygun dosya bulunamadı</AppText>
              <AppText muted>
                Seçilen kurum ve rol için yayımlanmış olayların tarih ve koşulları kontrol edilmelidir.
              </AppText>
            </AppCard>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}
