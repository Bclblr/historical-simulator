import { createHistoricalEvent, type HistoricalEvent } from '@/domain/history';

const event = (
  id: string, title: string, summary: string, startDate: string, sortOrder: number,
  scope: 'NATIONAL' | 'INTERNATIONAL' = 'INTERNATIONAL',
): HistoricalEvent => createHistoricalEvent({
  id, eraId: 'germany-1921', countryIds: ['germany'], title, summary, startDate,
  scope, classification: 'HISTORICAL_FACT', sortOrder, status: 'PUBLISHED',
});

export const GERMANY_1939_1945_CHRONOLOGY: HistoricalEvent[] = [
  event('de-1939-czechoslovakia-dismembered','Almanya Çek topraklarını işgal etti','Mart 1939’da Alman yönetimi Çek topraklarını işgal ederek Bohemya ve Moravya Protektorası’nı kurdu.','1939-03-15',10),
  event('de-1939-molotov-ribbentrop','Alman-Sovyet Saldırmazlık Paktı imzalandı','Almanya ile Sovyetler Birliği bir saldırmazlık paktı imzaladı; gizli düzenlemeler Doğu Avrupa’daki nüfuz alanlarını ele alıyordu.','1939-08-23',20),
  event('de-1939-poland-invasion','Almanya Polonya’yı işgal etti','Almanya’nın Polonya’ya saldırması Avrupa’da II. Dünya Savaşı’nın başlamasına yol açtı.','1939-09-01',30),
  event('de-1939-britain-france-war','Birleşik Krallık ve Fransa Almanya’ya savaş ilan etti','Polonya’nın işgalinin ardından Birleşik Krallık ve Fransa Almanya’ya savaş ilan etti.','1939-09-03',40),
  event('de-1939-poland-divided','Polonya işgal altında bölündü','Alman ve Sovyet işgalleri sonucunda Polonya toprakları iki güç arasında bölündü ve geniş çaplı işgal yönetimleri kuruldu.','1939-09-28',50),
  event('de-1940-denmark-norway','Almanya Danimarka ve Norveç’i işgal etti','Alman kuvvetleri Nisan 1940’ta Danimarka ve Norveç’e saldırarak savaşın coğrafyasını genişletti.','1940-04-09',60),
  event('de-1940-western-offensive','Batı Avrupa harekâtı başladı','Almanya Hollanda, Belçika, Lüksemburg ve Fransa’ya saldırdı.','1940-05-10',70),
  event('de-1940-france-armistice','Fransa ile ateşkes imzalandı','Fransa’nın askerî yenilgisinin ardından Almanya ile Fransa arasında ateşkes imzalandı ve ülkenin önemli bölümü işgal altına girdi.','1940-06-22',80),
  event('de-1940-battle-of-britain','Britanya üzerindeki hava savaşı yoğunlaştı','1940 yazı ve sonbaharında Almanya ile Birleşik Krallık arasında yoğun hava savaşı yaşandı; Almanya Britanya’yı savaş dışı bırakamadı.','1940-07-10',90),
  event('de-1940-tripartite-pact','Üçlü Pakt imzalandı','Almanya, İtalya ve Japonya Üçlü Paktı imzalayarak Mihver ittifakını resmîleştirdi.','1940-09-27',100),
  event('de-1941-yugoslavia-greece','Almanya Yugoslavya ve Yunanistan’a saldırdı','Alman kuvvetleri Balkanlar’daki savaşın genişlemesi sırasında Yugoslavya ve Yunanistan’a saldırdı.','1941-04-06',110),
  event('de-1941-barbarossa','Sovyetler Birliği’nin işgali başladı','Almanya ve müttefikleri Sovyetler Birliği’ne saldırarak Doğu Cephesi’ndeki büyük savaşı başlattı.','1941-06-22',120),
  event('de-1941-mass-murder-escalation','İşgal altındaki Sovyet topraklarında kitlesel katliamlar genişledi','Alman işgalinin ardından SS ve polis birlikleri ile işbirlikçileri Yahudilere ve başka hedef gruplara yönelik sistematik kitlesel katliamları genişletti.','1941-07-01',130),
  event('de-1941-germany-declares-war-us','Almanya ABD’ye savaş ilan etti','Pearl Harbor saldırısından birkaç gün sonra Almanya Amerika Birleşik Devletleri’ne savaş ilan etti.','1941-12-11',140),
  event('de-1942-wannsee','Wannsee Konferansı yapıldı','Üst düzey Alman yetkililer, Avrupa Yahudilerinin sistematik olarak öldürülmesine yönelik hâlihazırdaki politikanın kurumlar arası koordinasyonunu görüştü.','1942-01-20',150),
  event('de-1942-stalingrad-battle','Stalingrad Muharebesi başladı','1942 yazında başlayan Stalingrad savaşı Doğu Cephesi’nin başlıca dönüm noktalarından biri hâline geldi.','1942-08-23',160),
  event('de-1943-stalingrad-surrender','Stalingrad’daki Alman kuvvetleri teslim oldu','Stalingrad’daki Alman kuvvetlerinin teslim olması Almanya açısından savaşın önemli askerî ve siyasi dönüm noktalarından biri oldu.','1943-02-02',170),
  event('de-1943-total-war-speech','“Topyekûn savaş” seferberliği propagandası yoğunlaştırıldı','Stalingrad yenilgisinin ardından rejim, toplumun savaş ekonomisine ve seferberliğe daha fazla bağlanmasını isteyen propaganda kampanyasını yoğunlaştırdı.','1943-02-18',180),
  event('de-1943-italy-armistice','İtalya Müttefiklerle ateşkes yaptı','İtalya’nın ateşkes ilanı Mihver ittifakında büyük bir kırılma yarattı ve Almanya İtalya’daki askerî varlığını genişletti.','1943-09-08',190),
  event('de-1944-normandy','Müttefikler Normandiya’ya çıktı','Batılı Müttefiklerin Normandiya çıkarması Batı Avrupa’da Almanya’ya karşı yeni ve büyük bir cephe açtı.','1944-06-06',200),
  event('de-1944-july-plot','20 Temmuz suikast ve darbe girişimi başarısız oldu','Alman askerî ve sivil muhaliflerinden oluşan bir grubun Hitler’i öldürme ve yönetimi değiştirme girişimi başarısız oldu.','1944-07-20',210),
  event('de-1944-warsaw-uprising','Varşova Ayaklanması başladı','Polonya Yeraltı Devleti’ne bağlı güçler Alman işgaline karşı Varşova’da ayaklanma başlattı.','1944-08-01',220),
  event('de-1944-ardennes','Ardenler Taarruzu başladı','Almanya Batı Cephesi’nde son büyük saldırılarından birini başlattı; harekât stratejik hedeflerine ulaşamadı.','1944-12-16',230),
  event('de-1945-auschwitz-liberated','Auschwitz kamp kompleksi özgürleştirildi','Sovyet birlikleri Auschwitz kamp kompleksine ulaştı ve hayatta kalan mahkûmları özgürleştirdi.','1945-01-27',240),
  event('de-1945-rhine-crossing','Müttefik orduları Almanya içlerine ilerledi','1945 baharında Batılı Müttefikler Ren’i geçerek Almanya’nın iç bölgelerine doğru ilerledi.','1945-03-23',250),
  event('de-1945-berlin-battle','Berlin Muharebesi başladı','Sovyet kuvvetlerinin Berlin’e yönelik saldırısı Nazi rejiminin son günlerini başlattı.','1945-04-16',260),
  event('de-1945-hitler-death','Adolf Hitler öldü','Adolf Hitler Berlin’de öldü; rejimin liderlik yapısı savaşın son günlerinde hızla çözüldü.','1945-04-30',270),
  event('de-1945-german-surrender','Almanya’nın koşulsuz teslimiyeti yürürlüğe girdi','Alman silahlı kuvvetlerinin koşulsuz teslimiyeti Avrupa’daki savaşı sona erdirdi ve Nazi rejiminin tarihsel dönemi kapandı.','1945-05-08',280),
];
