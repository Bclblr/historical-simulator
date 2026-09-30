import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ArchiveScreen() {
  return <View style={styles.container}><Stack.Screen options={{ title:'Arşiv', headerShown:true }} /><Text style={styles.title}>Arşiv</Text><Text style={styles.text}>Keşfedilen olaylar, belgeler, kaynaklar ve zaman çizgisi burada toplanacak.</Text></View>;
}
const styles=StyleSheet.create({container:{flex:1,padding:28,paddingTop:80,backgroundColor:'#F1EBDD'},title:{fontSize:30,fontWeight:'800',color:'#211E19'},text:{marginTop:12,fontSize:16,lineHeight:24,color:'#625B50'}});
