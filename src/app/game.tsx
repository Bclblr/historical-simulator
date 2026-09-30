import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/theme';
export default function GameScreen(){const p=useLocalSearchParams<{era?:string;country?:string;institution?:string;role?:string}>();const t=useAppTheme();return <View style={[s.c,{backgroundColor:t.colors.background}]}><Stack.Screen options={{title:'Simülasyon',headerShown:true}}/><Text style={[s.eye,{color:t.colors.textSubtle}]}>OTURUM HAZIR</Text><Text style={[s.title,{color:t.colors.text}]}>{p.era??'1933'} · {p.country??'germany'}</Text><Text style={[s.desc,{color:t.colors.textMuted}]}>Kurum: {p.institution??'—'}{'
'}Rol: {p.role??'—'}</Text><Text style={[s.note,{color:t.colors.textMuted,borderColor:t.colors.border}]}>Event Engine ve GameState sonraki motor aşamalarında bu rotaya bağlanacak.</Text></View>}
const s=StyleSheet.create({c:{flex:1,justifyContent:'center',padding:28},eye:{fontSize:12,fontWeight:'800',letterSpacing:2},title:{marginTop:10,fontSize:32,fontWeight:'800'},desc:{marginTop:16,fontSize:16,lineHeight:25},note:{marginTop:30,padding:18,borderWidth:1,fontSize:14,lineHeight:21}});
