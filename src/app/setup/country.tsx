import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
export default function CountryScreen(){const {era}=useLocalSearchParams<{era?:string}>();return <Screen><Stack.Screen options={{title:'Devlet Seçimi'}}/><SectionHeader eyebrow={`2 / 4 · ${era??'Dönem'}`} title="Bir devlet seç"/><Link href={{pathname:'/setup/institution',params:{era:era??'1933',country:'germany'}}} asChild><AppCard interactive style={s.card}><AppText variant="heading">Almanya</AppText><AppText muted style={s.text}>İlk içerik paketi. Motor Almanya'ya özel değildir.</AppText></AppCard></Link></Screen>}
const s=StyleSheet.create({card:{marginTop:28},text:{marginTop:8}});
