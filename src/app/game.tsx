import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { AppCard, AppText, DeskScreen, Screen } from '@/components';
import type { GameState } from '@/domain/game';
import { useGameSessionService } from '@/services';
import { getScenarioForSelection } from '@/content/scenario-catalog';

export default function GameScreen() {
  const params = useLocalSearchParams<{ sessionId?: string; era?: string; country?: string; institution?: string; role?: string }>();
  const sessions = useGameSessionService();
  const [state, setState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Screen centered>
      <Stack.Screen options={{ title: 'Simülasyon', headerShown: true }} />
      <AppText variant="label" muted>{error ? 'KAYIT HATASI' : state ? 'OTURUM KAYDEDİLDİ' : 'OTURUM HAZIRLANIYOR'}</AppText>
      {error ? (
        <AppCard style={styles.card}><AppText>{error}</AppText></AppCard>
      ) : state ? (
        <DeskScreen state={state} />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 10 },
  description: { marginTop: 16 },
  card: { marginTop: 28 },
});
