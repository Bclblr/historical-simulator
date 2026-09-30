import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { AppCard, AppText, Screen, SectionHeader } from '@/components';
export default function EraScreen(){return <Screen><Stack.Screen options={{title:'Dönem Seçimi'}}/><SectionHeader eyebrow="1 / 4" title="Bir dönem seç" description="İlk prototip 1933 ile başlıyor. Yeni dönemler aynı oyun motoruna eklenecek."/><Link href="/setup/country?era=1933" asChild><AppCard interactive style={s.card}><AppText variant="heading">1933</AppText><AppText muted style={s.text}>Avrupa'da siyasal dönüşüm ve uluslararası belirsizlik dönemi.</AppText></AppCard></Link></Screen>}
const s=StyleSheet.create({card:{marginTop:28},text:{marginTop:8}});
