import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function InstitutionScreen() {
  const params = useLocalSearchParams<{ era?: string; country?: string }>();
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Kurum Seçimi' }} />
      <Text style={styles.step}>3 / 4</Text>
      <Text style={styles.title}>Bir kurum seç</Text>
      <Text style={styles.description}>İlk kurum, 67/100 içerik aşamasındaki kaynak araştırmasıyla kesinleştirilecek.</Text>
      <Link href={{ pathname: '/setup/role', params: { ...params, institution: 'prototype' } }} asChild>
        <Pressable style={styles.card}>
          <Text style={styles.cardTitle}>Prototip Kurum</Text>
          <Text style={styles.cardText}>Şimdilik navigasyon ve motor entegrasyonu için yer tutucu.</Text>
        </Pressable>
      </Link>
    </View>
  );
}
const styles=StyleSheet.create({
 container:{flex:1,padding:24,paddingTop:32,backgroundColor:'#F1EBDD'},
 step:{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:'#776B59'},
 title:{marginTop:10,fontSize:30,fontWeight:'800',color:'#211E19'},
 description:{marginTop:10,fontSize:15,lineHeight:22,color:'#625B50'},
 card:{marginTop:28,padding:22,borderWidth:1,borderColor:'#C9BEAA',backgroundColor:'#E8DFCE'},
 cardTitle:{fontSize:22,fontWeight:'800',color:'#211E19'},
 cardText:{marginTop:8,fontSize:14,lineHeight:21,color:'#625B50'},
});
