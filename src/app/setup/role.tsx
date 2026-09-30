import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function RoleScreen() {
  const params = useLocalSearchParams<{ era?: string; country?: string; institution?: string }>();
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Rol Seçimi' }} />
      <Text style={styles.step}>4 / 4</Text>
      <Text style={styles.title}>Görevini seç</Text>
      <Link href={{ pathname: '/game', params: { ...params, role: 'prototype-role' } }} asChild>
        <Pressable style={styles.card}>
          <Text style={styles.cardTitle}>Prototip Rol</Text>
          <Text style={styles.cardText}>Oyun motoru tamamlandığında tarihsel görev verisiyle değiştirilecek.</Text>
        </Pressable>
      </Link>
    </View>
  );
}
const styles=StyleSheet.create({
 container:{flex:1,padding:24,paddingTop:32,backgroundColor:'#F1EBDD'},
 step:{fontSize:12,fontWeight:'700',letterSpacing:1.2,color:'#776B59'},
 title:{marginTop:10,fontSize:30,fontWeight:'800',color:'#211E19'},
 card:{marginTop:28,padding:22,borderWidth:1,borderColor:'#C9BEAA',backgroundColor:'#E8DFCE'},
 cardTitle:{fontSize:22,fontWeight:'800',color:'#211E19'},
 cardText:{marginTop:8,fontSize:14,lineHeight:21,color:'#625B50'},
});
