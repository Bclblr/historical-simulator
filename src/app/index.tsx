import { Link, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppText, Screen } from '@/components';
import type { GameState } from '@/domain/game';
import { useGameSessionService } from '@/services';

export default function HomeScreen() {
  const sessions = useGameSessionService();
  const [recent, setRecent] = useState<GameState | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void sessions.resumeMostRecent().then((state) => {
        if (active) setRecent(state);
      }).catch(() => {
        if (active) setRecent(null);
      });
      return () => { active = false; };
    }, [sessions]),
  );

  return (
    <Screen centered style={styles.screen}>
      <AppText variant="label" muted>HISTORICAL SIMULATOR</AppText>
      <AppText variant="display" style={styles.title}>Tarihi yalnızca okuma. Kararların sonuçlarını incele.</AppText>
      <AppText muted style={styles.description}>Akademik kaynaklara dayalı, çok devletli ve çok kurumlu tarih simülasyonu.</AppText>
      <View style={styles.actions}>
        {recent ? (
          <AppButton onPress={() => router.push({ pathname: '/game', params: { sessionId: recent.sessionId } })}>
            Devam Et · {recent.currentDate}
          </AppButton>
        ) : null}
        <Link href="/setup/era" asChild><AppButton variant={recent ? 'secondary' : 'primary'}>Yeni Oyun</AppButton></Link>
        <Link href="/archive" asChild><AppButton variant="secondary">Arşiv</AppButton></Link>
        <Link href="/settings" asChild><AppButton variant="ghost">Ayarlar</AppButton></Link>
      </View>
    </Screen>
  );
}
const styles=StyleSheet.create({screen:{paddingHorizontal:28},title:{marginTop:12,maxWidth:520},description:{marginTop:16,maxWidth:520},actions:{maxWidth:520,marginTop:36,gap:12}});
