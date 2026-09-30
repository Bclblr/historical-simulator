import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
export default function RoleScreen(){const p=useLocalSearchParams<{era?:string;country?:string;institution?:string}>();return <Screen><Stack.Screen options={{title:'Rol Seçimi'}}/><SectionHeader eyebrow="4 / 4" title="Görevini seç"/><Link href={{pathname:'/game',params:{...p,role:'prototype-role'}}} asChild><AppCard interactive style={s.card}><AppText variant="heading">Prototip Rol</AppText><AppText muted style={s.text}>Oyun motoru tamamlandığında tarihsel görev verisiyle değiştirilecek.</AppText></AppCard></Link></Screen>}
const s=StyleSheet.create({card:{marginTop:28},text:{marginTop:8}});
