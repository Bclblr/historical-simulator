import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppCard, AppText, Screen } from '@/components';
import type { GameState } from '@/domain/game';
import { useGameSessionService } from '@/services';

export default function HomeScreen() {
  const sessions = useGameSessionService();
  const [recent, setRecent] = useState<GameState | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void sessions
        .resumeMostRecent()
        .then((snapshot) => {
          if (active) setRecent(snapshot?.state ?? null);
        })
        .catch(() => {
          if (active) setRecent(null);
        });
      return () => {
        active = false;
      };
    }, [sessions]),
  );

  return (
    <Screen centered style={styles.screen}>
      <View style={styles.hero}>
        <AppText variant="label" muted>
          TARİH SİMÜLATÖRÜ
        </AppText>
        <AppText variant="display" style={styles.title}>
          Tarihi yalnızca okuma. Kararların sonuçlarını incele.
        </AppText>
        <AppText muted style={styles.description}>
          Akademik kaynaklara dayalı, çok devletli ve çok kurumlu tarih simülasyonu.
          Tarihsel kayıt ile alternatif sonuçlar açıkça birbirinden ayrılır.
        </AppText>
      </View>

      {recent ? (
        <AppCard style={styles.resumeCard}>
          <AppText variant="label" muted>
            SON OTURUM
          </AppText>
          <AppText variant="heading" style={styles.resumeTitle}>
            {recent.selection.eraId} · {recent.selection.countryId === 'germany' ? 'Almanya' : recent.selection.countryId}
          </AppText>
          <AppText muted>{recent.currentDate}</AppText>
          <AppButton
            onPress={() =>
              router.push({
                pathname: '/game',
                params: { sessionId: recent.sessionId },
              })
            }
          >
            Devam Et
          </AppButton>
        </AppCard>
      ) : null}

      <View style={styles.actions}>
        <Link href="/setup/era" asChild>
          <AppButton variant="primary">Yeni Simülasyon</AppButton>
        </Link>
        <Link href="/archive" asChild>
          <AppButton variant="secondary">Arşiv</AppButton>
        </Link>
        <Link href="/settings" asChild>
          <AppButton variant="ghost">Ayarlar</AppButton>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 28 },
  hero: { width: '100%', maxWidth: 560 },
  title: { marginTop: 12 },
  description: { marginTop: 16 },
  resumeCard: { width: '100%', maxWidth: 560, marginTop: 28, gap: 12 },
  resumeTitle: { marginTop: 4 },
  actions: { width: '100%', maxWidth: 560, marginTop: 24, gap: 12 },
});
