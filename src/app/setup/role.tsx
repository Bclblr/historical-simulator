import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
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

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Rol Seçimi' }} />
      <SectionHeader
        eyebrow="4 / 4"
        title="Görevini seç"
        description="Rol, kurum içindeki bakış açını belirler. Kurgusal roller tarihsel kişilerden açıkça ayrılır."
      />
      {roles.length ? (
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
});
