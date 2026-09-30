import { Link, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function EraScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Dönem Seçimi' }} />
      <Text style={styles.step}>1 / 4</Text>
      <Text style={styles.title}>Bir dönem seç</Text>
      <Text style={styles.description}>İlk prototip 1933 ile başlıyor. Yeni dönemler aynı oyun motoruna eklenecek.</Text>
      <Link href="/setup/country?era=1933" asChild>
        <Pressable style={styles.card}>
          <Text style={styles.cardTitle}>1933</Text>
          <Text style={styles.cardText}>Avrupa'da siyasal dönüşüm ve uluslararası belirsizlik dönemi.</Text>
        </Pressable>
      </Link>
    </View>
  );
}
const styles=StyleSheet.create({
 container:{flex:1,padding:24,paddingTop:32,backgroundColor:'#F1EBDD'},
 step:{fontSize:12,fontWeight:'700',letterSpacing:1.5,color:'#776B59'},
 title:{marginTop:10,fontSize:30,fontWeight:'800',color:'#211E19'},
 description:{marginTop:10,maxWidth:560,fontSize:16,lineHeight:24,color:'#625B50'},
 card:{marginTop:28,padding:22,borderWidth:1,borderColor:'#C9BEAA',backgroundColor:'#E8DFCE'},
 cardTitle:{fontSize:24,fontWeight:'800',color:'#211E19'},
 cardText:{marginTop:8,fontSize:14,lineHeight:21,color:'#625B50'},
});
