# Historical Simulator — Ürün Vizyonu ve Kapsam

## Ürün tanımı
Historical Simulator, akademik kaynaklara dayanan tek oyunculu bir tarihsel karar ve kurum simülasyonudur. Oyuncu belirli bir dönem, devlet, kurum ve görev perspektifinden mevcut bilgi ve belgeleri değerlendirir; kararlarının kısa ve uzun vadeli sonuçlarını görür.

## Uzun vadeli mimari
Çekirdek motor herhangi bir devlete, döneme veya ideolojiye özel olmayacaktır.

**Era → Country → Institution → Role → Event → Document → Decision → Consequence**

İlk içerik paketi 1933 Almanya ile başlayacaktır. Aynı altyapı daha sonra Britanya, ABD, SSCB, Fransa, İtalya, Japonya, Çin, Türkiye ve başka devletlere; ardından farklı tarihsel dönemlere genişletilebilecektir.

## Temel oyun döngüsü
1. Dönem, devlet, kurum ve rol seçilir.
2. Tarihsel takvim ilerler.
3. Oyuncuya rolünün erişebileceği dosya, rapor, telgraf, gazete ve diğer bilgiler sunulur.
4. Oyuncu bilgiyi inceler ve karar verir.
5. Kararlar GameState, kurum ilişkileri, değişkenler ve flag'ler üzerinde etkiler oluşturur.
6. Bazı etkiler hemen, bazıları ilerleyen tarihlerde ortaya çıkar.
7. Arşiv, tarihsel gerçekliği oyuncunun kontrafaktüel zaman çizgisinden açıkça ayırır.

## Oyunu farklılaştıran sistemler
- İkili seçimle sınırlı olmayan kararlar
- Belge/dosya inceleme
- Kurumlar arası ilişkiler
- Aynı olayın farklı kurum ve devlet perspektifleri
- Eksik veya farklı güvenilirlikte bilgi
- Gerçek tarihsel takvim
- Harita ve zaman çizelgesi
- Gecikmeli sonuçlar
- Önceki kararların sonraki olayları değiştirmesi
- Akademik kaynak ekranı
- Gerçek tarih ile kontrafaktüel simülasyonun ayrı tutulması

## Akademik bütünlük
İçerik dört katmanda tutulacaktır:

### Belgelenmiş tarihsel gerçek
Tarih, kişi, kurum, belge ve olaylar güvenilir kaynaklarla doğrulanır.

### Birincil kaynak
Devlet belgesi, günlük, mektup, konuşma, gazete, istatistik veya arşiv kaydı kendi bağlamı içinde kullanılır. Bir belgenin iddiası otomatik olarak nesnel gerçek kabul edilmez.

### Akademik yorum
Modern akademik çalışmalar kullanılır. Tarihçiler arasında anlamlı yorum ayrılığı varsa tek yorum tartışmasız gerçek gibi sunulmaz.

### Kontrafaktüel simülasyon
Oyuncunun tarihsel akıştan ayrılan kararları ve bunlardan türeyen sonuçlar açıkça simülasyon olarak etiketlenir.

Uydurma sözler gerçek alıntı gibi sunulmaz. Oyun için oluşturulan diyalog veya metin gerektiğinde dramatizasyon/uyarlama olarak işaretlenir.

## Kaynak standardı
Genel öncelik:
1. Arşiv belgeleri ve güvenilir birincil kaynak koleksiyonları
2. Akademik yayınevlerinden monografiler
3. Hakemli akademik makaleler
4. Saygın tarih araştırma kurumlarının koleksiyonları
5. Yardımcı referans kaynakları

İlk Almanya içeriğinin başlangıç havuzunda Bundesarchiv, German History in Documents and Images (GHDI), United States Holocaust Memorial Museum koleksiyonları ve ilgili akademik literatür bulunacaktır.

İçerik kayıtları mümkün olduğunca kaynak kimliği, yazar/kurum, başlık, tarih, yayın/arşiv bilgisi, sayfa veya belge numarası ve bağlantı alanlarını destekleyecektir.

## Hassas tarihsel içerik
Savaş, diktatörlük, devlet şiddeti, zulüm ve kitlesel suçlar tarihsel bağlamları içinde olgusal biçimde ele alınabilir. Oyun sistemi insanlara zarar vermeyi veya baskıyı daha verimli gerçekleştirmeyi öğreten bir optimizasyon sistemine dönüşmeyecektir.

## İlk oynanabilir dikey dilim
- Dönem: 1933
- Devlet: Almanya
- İlk prototipte tek kurum
- Tek başlangıç rolü
- Yaklaşık 30–50 kaynaklandırılmış olay
- Karar sistemi
- GameState
- Flag ve koşul sistemi
- Gecikmeli sonuçlar
- Yerel kayıt
- Kaynak ekranı
- Arşiv
- Gerçek tarih / simülasyon ayrımı

İlk kurum içerik araştırması sırasında seçilecek; çekirdek motor bu kuruma bağımlı olmayacaktır.

## İlk prototipte kapsam dışı
1933–1945'in tamamı, bütün kurumlar ve devletler, multiplayer, zorunlu hesap, cloud save, canlı backend, 3D motor, kaynaksız yapay zekâ ile tarihsel olay üretimi ve nihai monetizasyon sistemi.

## Teknik ilkeler
React Native, Expo, TypeScript, Expo Router, SQLite, Reanimated ve Gesture Handler kullanılacaktır. Uygulama offline-first olacaktır. İlk prototipte Supabase/backend zorunlu değildir. İçerik ve oyun motoru birbirinden ayrılacak; Almanya'ya özgü kurallar çekirdek motora gömülmeyecektir.

## Başarı kriteri
İlk dikey dilimde oyuncu 1933 oturumu başlatabilmeli, rolüne uygun olay ve belgeleri görebilmeli, karar verebilmeli, kararların durum üzerindeki etkilerini taşıyabilmeli, önceki kararların sonraki olayları değiştirdiğini görebilmeli, kaydını sürdürebilmeli, kaynakları inceleyebilmeli ve tarihsel gerçek ile alternatif zaman çizgisini ayırt edebilmelidir.

## Tasarım ilkesi
Historical Simulator bir tarih ansiklopedisine oyun görünümü verme projesi değildir. Akademik olarak izlenebilir tarihsel içerik ile sistemik karar simülasyonunu birleştiren tekrar oynanabilir bir tarih deneyimidir.
