import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppCard, AppText, Screen, SectionHeader } from '@/components';
import { getPublishedInstitutionsForSelection } from '@/content/scenario-catalog';

export default function InstitutionScreen() {
  const params = useLocalSearchParams<{ era?: string; country?: string }>();
  const era = typeof params.era === 'string' ? params.era : '';
  const country = typeof params.country === 'string' ? params.country : '';
  const institutions = getPublishedInstitutionsForSelection(era, country);

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Kurum Seçimi' }} />
      <SectionHeader
        eyebrow="3 / 4"
        title="Bir kurum seç"
        description="Kurum seçimi hangi dosyaları, yetkileri ve kurumsal perspektifi göreceğini belirler."
      />
      {institutions.length ? (
        <View style={styles.list}>
          {institutions.map((institution) => (
            <Link
              key={institution.id}
              href={{
                pathname: '/setup/role',
                params: { era, country, institution: institution.id },
              }}
              asChild
            >
              <AppCard interactive>
                <AppText variant="heading">{institution.name}</AppText>
                <AppText variant="label" muted style={styles.meta}>
                  {institution.type}
                </AppText>
                <AppText muted style={styles.text}>{institution.description}</AppText>
              </AppCard>
            </Link>
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <AppText variant="heading">Yayımlanmış kurum bulunamadı</AppText>
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
