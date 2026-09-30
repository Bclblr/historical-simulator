import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
export default function InstitutionScreen(){const p=useLocalSearchParams<{era?:string;country?:string}>();return <Screen><Stack.Screen options={{title:'Kurum Seçimi'}}/><SectionHeader eyebrow="3 / 4" title="Bir kurum seç" description="İlk kurum, 67/100 içerik aşamasındaki kaynak araştırmasıyla kesinleştirilecek."/><Link href={{pathname:'/setup/role',params:{...p,institution:'prototype'}}} asChild><AppCard interactive style={s.card}><AppText variant="heading">Prototip Kurum</AppText><AppText muted style={s.text}>Şimdilik navigasyon ve motor entegrasyonu için yer tutucu.</AppText></AppCard></Link></Screen>}
const s=StyleSheet.create({card:{marginTop:28},text:{marginTop:8}});
