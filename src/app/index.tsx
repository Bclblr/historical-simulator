import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppButton, AppText, Screen } from '@/components';

export default function HomeScreen() {
  return (
    <Screen centered style={styles.screen}>
      <AppText variant="label" muted>HISTORICAL SIMULATOR</AppText>
      <AppText variant="display" style={styles.title}>Tarihi yalnızca okuma. Kararların sonuçlarını incele.</AppText>
      <AppText muted style={styles.description}>Akademik kaynaklara dayalı, çok devletli ve çok kurumlu tarih simülasyonu.</AppText>
      <View style={styles.actions}>
        <Link href="/setup/era" asChild><AppButton>Yeni Oyun</AppButton></Link>
        <Link href="/archive" asChild><AppButton variant="secondary">Arşiv</AppButton></Link>
        <Link href="/settings" asChild><AppButton variant="ghost">Ayarlar</AppButton></Link>
      </View>
    </Screen>
  );
}
const styles=StyleSheet.create({screen:{paddingHorizontal:28},title:{marginTop:12,maxWidth:520},description:{marginTop:16,maxWidth:520},actions:{maxWidth:520,marginTop:36,gap:12}});
