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
  const [selectedRole, setSelectedRole] = useState(roles[0]?.id ?? '');
  const isLifeCampaign = era === 'germany-1921' || era === 'mediterranean-1550';

  return (
    <Screen>
      <Stack.Screen options={{ title: isLifeCampaign ? 'Karakter' : 'Rol Seçimi' }} />
      <SectionHeader
        eyebrow="4 / 4"
        title={isLifeCampaign ? 'Karakterini oluştur' : 'Görevini seç'}
        description={isLifeCampaign
          ? era === 'mediterranean-1550'
            ? '16. yüzyıl Akdeniz dünyasında kurgusal karakterinin adını ve başlangıç yolunu belirle. Liman, deniz, ticaret ve bilgi ağları seçimlerinle şekillenecek.'
            : '1933 Almanyası’nda yaşayan kurgusal karakterinin adını belirle. Mesleğin, çevren ve yaşam çizgin seçim yaptıkça şekillenecek.'
          : 'Rol, kurum içindeki bakış açını belirler. Kurgusal roller tarihsel kişilerden açıkça ayrılır.'}
      />
      {isLifeCampaign ? (
        <View style={styles.list}>
          <AppText variant="label" muted>BAŞLANGIÇ YOLU</AppText>
          {roles.map((role) => (
            <AppCard
              key={role.id}
              interactive
              onPress={() => setSelectedRole(role.id)}
              style={selectedRole === role.id ? { borderColor: theme.colors.primary, borderWidth: 2 } : undefined}
            >
              <AppText variant="heading">{role.name}</AppText>
              <AppText muted style={styles.text}>{role.description}</AppText>
            </AppCard>
          ))}
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
              disabled={!playerName.trim() || !selectedRole}
              onPress={() => router.push({
                pathname: '/game',
                params: {
                  era,
                  country,
                  institution,
                  role: selectedRole,
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
