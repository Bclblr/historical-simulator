import { Link, Stack, router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import {
  AppButton,
  AppCard,
  AppText,
  Screen,
  SectionHeader,
} from '@/components';
import {
  getPublishedCountriesForEra,
  getPublishedInstitutionsForSelection,
} from '@/content/scenario-catalog';

export default function CountryScreen() {
  const { era } = useLocalSearchParams<{ era?: string }>();
  const eraId = typeof era === 'string' ? era : '';
  const countries = getPublishedCountriesForEra(eraId);

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Devlet Seçimi' }} />
      <SectionHeader
        eyebrow={`2 / 4 · ${eraId || 'Dönem seçilmedi'}`}
        title="Bir devlet seç"
        description="Yalnızca seçilen dönem için yayımlanmış içerik paketleri gösterilir."
      />
      {countries.length ? (
        <View style={styles.list}>
          {countries.map((country) => {
            const defaultInstitution =
              eraId === 'germany-1921'
                ? getPublishedInstitutionsForSelection(eraId, country.id)[0]
                : undefined;

            return (
            <Link
              key={country.id}
              href={
                eraId === 'germany-1921' && defaultInstitution
                  ? {
                      pathname: '/setup/role',
                      params: {
                        era: eraId,
                        country: country.id,
                        institution: defaultInstitution.id,
                      },
                    }
                  : {
                      pathname: '/setup/institution',
                      params: { era: eraId, country: country.id },
                    }
              }
              asChild
            >
              <AppCard interactive>
                <AppText variant="heading">{country.name}</AppText>
                <AppText muted style={styles.text}>
                  {country.description}
                </AppText>
              </AppCard>
            </Link>
            );
          })}
        </View>
      ) : (
        <View style={styles.empty}>
          <AppText variant="heading">Yayımlanmış devlet bulunamadı</AppText>
          <AppText muted style={styles.text}>
            Önce geçerli bir dönem seç.
          </AppText>
          <AppButton variant="secondary" onPress={() => router.replace('/setup/era')}>
            Dönem seçimine dön
          </AppButton>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: 28, gap: 12 },
  empty: { marginTop: 28, gap: 14 },
  text: { marginTop: 8 },
});
