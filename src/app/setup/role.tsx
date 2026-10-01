import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';
import { useState } from 'react';
import { useAppTheme } from '@/theme';
import { AppButton, AppCard, AppText, Screen, SectionHeader } from '@/components';
import { getPublishedRolesForInstitution } from '@/content/scenario-catalog';

export default function RoleScreen() {
  const params = useLocalSearchParams<{
    era?: string;
    country?: string;
    institution?: string;
  }>();
  const era = typeof params.era === 'string' ? params.era : '';
  const country = typeof params.country === 'string' ? params.country : '';
  const institution =
    typeof params.institution === 'string' ? params.institution : '';
  const roles = getPublishedRolesForInstitution(era, country, institution);
  const theme = useAppTheme();
  const [playerName, setPlayerName] = useState('');
  const isGermanyCampaign = era === 'germany-1921';

  return (
    <Screen>
      <Stack.Screen options={{ title: isGermanyCampaign ? 'Karakter' : 'Rol Seçimi' }} />
      <SectionHeader
        eyebrow="4 / 4"
        title={isGermanyCampaign ? 'Karakterini oluştur' : 'Görevini seç'}
        description={isGermanyCampaign
          ? '1933 Almanyası’nda yaşayan kurgusal karakterinin adını belirle. Mesleğin, çevren ve yaşam çizgin seçim yaptıkça şekillenecek.'
          : 'Rol, kurum içindeki bakış açını belirler. Kurgusal roller tarihsel kişilerden açıkça ayrılır.'}
      />
      {isGermanyCampaign && roles[0] ? (
        <View style={styles.list}>
          <AppCard>
            <AppText variant="label" muted>KARAKTER ADI</AppText>
            <TextInput
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Adını yaz"
              placeholderTextColor={theme.colors.textMuted}
              maxLength={40}
              style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
            />
            <AppButton
              disabled={!playerName.trim()}
              onPress={() => router.push({
                pathname: '/game',
                params: {
                  era,
                  country,
                  institution,
                  role: roles[0].id,
                  playerName: playerName.trim(),
                },
              })}
            >
              Hayatını Başlat
            </AppButton>
          </AppCard>
        </View>
      ) : roles.length ? (
        <View style={styles.list}>
          {roles.map((role) => (
            <Link
              key={role.id}
              href={{
                pathname: '/game',
                params: { era, country, institution, role: role.id },
              }}
              asChild
            >
              <AppCard interactive>
                <AppText variant="heading">{role.name}</AppText>
                <AppText variant="label" muted style={styles.meta}>
                  {role.type === 'ADMINISTRATIVE' ? 'İDARİ' : role.type}
                </AppText>
                <AppText muted style={styles.text}>{role.description}</AppText>
              </AppCard>
            </Link>
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <AppText variant="heading">Yayımlanmış rol bulunamadı</AppText>
          <AppButton variant="secondary" onPress={() => router.replace('/setup/era')}>
            Seçime baştan dön
          </AppButton>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 28, gap: 12 },
  empty: { marginTop: 28, gap: 14 },
  meta: { marginTop: 8 },
  text: { marginTop: 8 },
  input: { marginTop: 14, marginBottom: 18, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 18 },
});
