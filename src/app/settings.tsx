import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
import {
  getAudioPreferences,
  setAudioPreferences,
  getHapticPreferences,
  setHapticPreferences,
} from '@/services';
import { useAppTheme } from '@/theme';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const [audio, setAudio] = useState(getAudioPreferences());
  const [haptic, setHaptic] = useState(getHapticPreferences());

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Ayarlar', headerShown: true }} />
      <SectionHeader
        eyebrow="DENEYİM"
        title="Ayarlar"
        description="Atmosfer özellikleri oynanışı ve tarihsel içeriği değiştirmez."
      />
      <AppCard style={styles.card}>
        <View style={styles.row}>
          <View style={styles.copy}>
            <AppText variant="heading">Ses efektleri</AppText>
            <AppText muted>
              Belge, mesaj ve karar arayüzü için kısa çevresel ses işaretleri.
            </AppText>
          </View>
          <Switch
            value={audio.enabled}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.archive,
            }}
            onValueChange={(enabled) =>
              setAudio(setAudioPreferences({ enabled }))
            }
          />
        </View>
        <AppText variant="label" muted>
          SES DÜZEYİ · %{Math.round(audio.volume * 100)}
        </AppText>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View style={styles.copy}>
            <AppText variant="heading">Haptic geri bildirim</AppText>
            <AppText muted>
              Seçim ve belge etkileşimlerinde hafif dokunsal geri bildirim.
            </AppText>
          </View>
          <Switch
            value={haptic.enabled}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.archive,
            }}
            onValueChange={(enabled) =>
              setHaptic(setHapticPreferences({ enabled }))
            }
          />
        </View>
      </AppCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 28, gap: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  copy: { flex: 1, gap: 8 },
  divider: { height: 1, opacity: 0.35 },
});
