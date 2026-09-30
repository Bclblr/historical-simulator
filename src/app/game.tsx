import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function GameScreen() {
  const params = useLocalSearchParams<{ era?: string; country?: string; institution?: string; role?: string }>();
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Simülasyon', headerShown: true }} />
      <Text style={styles.eyebrow}>OTURUM HAZIR</Text>
      <Text style={styles.title}>{params.era ?? '1933'} · {params.country ?? 'germany'}</Text>
      <Text style={styles.description}>Kurum: {params.institution ?? '—'}{'
'}Rol: {params.role ?? '—'}</Text>
      <Text style={styles.note}>Event Engine ve GameState sonraki motor aşamalarında bu rotaya bağlanacak.</Text>
    </View>
  );
}
const styles=StyleSheet.create({
 container:{flex:1,justifyContent:'center',padding:28,backgroundColor:'#F1EBDD'},
 eyebrow:{fontSize:12,fontWeight:'800',letterSpacing:2,color:'#776B59'},
 title:{marginTop:10,fontSize:32,fontWeight:'800',color:'#211E19'},
 description:{marginTop:16,fontSize:16,lineHeight:25,color:'#625B50'},
 note:{marginTop:30,padding:18,borderWidth:1,borderColor:'#C9BEAA',fontSize:14,lineHeight:21,color:'#625B50'},
});
