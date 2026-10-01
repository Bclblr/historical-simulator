import { createHistoricalEvent, type HistoricalEvent } from '@/domain/history';

const event = (
  id: string, title: string, summary: string, startDate: string, sortOrder: number,
  scope: 'NATIONAL' | 'INTERNATIONAL' = 'NATIONAL',
): HistoricalEvent => createHistoricalEvent({
  id, eraId: 'germany-1921', countryIds: ['germany'], title, summary, startDate,
  scope, classification: 'HISTORICAL_FACT', sortOrder, status: 'PUBLISHED',
});

export const GERMANY_1934_1938_CHRONOLOGY: HistoricalEvent[] = [
  event('de-1934-labor-front-exclusion','Yahudilerin Alman Emek Cephesi üyeliği yasaklandı','Bir hükûmet düzenlemesi Yahudileri Alman Emek Cephesi üyeliğinden dışlayarak çalışma yaşamındaki ayrımcılığı ağırlaştırdı.','1934-01-24',10),
  event('de-1934-roehm-purge','SA liderliğine yönelik tasfiye gerçekleştirildi','Haziran sonu ve temmuz başında rejim, SA liderliği ile başka siyasi rakiplere yönelik ölümcül bir tasfiye gerçekleştirdi.','1934-06-30',20),
  event('de-1934-hindenburg-dies','Cumhurbaşkanı Hindenburg öldü','Paul von Hindenburg’un ölümü, devlet başkanlığı makamının yeniden düzenlenmesinin önünü açtı.','1934-08-02',30),
  event('de-1934-fuehrer-office','Cumhurbaşkanlığı ve şansölyelik yetkileri birleştirildi','Hindenburg’un ölümünün ardından Hitler devlet başkanlığı ve şansölyelik yetkilerini kendi makamında birleştirdi.','1934-08-02',40),
  event('de-1934-referendum','Yeni liderlik düzeni referanduma sunuldu','19 Ağustos referandumu rejimin devlet başkanlığı ile hükûmet liderliğini birleştiren düzenlemesine siyasi onay üretmek için kullanıldı.','1934-08-19',50),
  event('de-1934-camp-inspectorate','Toplama kampları müfettişliği oluşturuldu','SS yönetimi toplama kampı sisteminin merkezileştirilmesini kurumsallaştıran bir müfettişlik oluşturdu.','1934-12-10',60),
  event('de-1935-saar-plebiscite','Saar plebisiti yapıldı','Saar bölgesindeki plebisitte seçmenlerin büyük çoğunluğu bölgenin Almanya’ya dönmesi yönünde oy kullandı.','1935-01-13',70,'INTERNATIONAL'),
  event('de-1935-conscription','Zorunlu askerlik yeniden getirildi','Alman hükûmeti Versailles düzenlemelerine aykırı biçimde zorunlu askerliği yeniden yürürlüğe koydu.','1935-03-16',80),
  event('de-1935-nuremberg-laws','Nürnberg Yasaları kabul edildi','Nürnberg Yasaları Yahudileri vatandaşlık haklarından mahrum bırakan ve evlilik ile özel yaşam üzerinde ırkçı ayrımlar kuran yasal çerçeveyi genişletti.','1935-09-15',90),
  event('de-1936-rhineland','Alman birlikleri Ren bölgesine girdi','Alman askerî birlikleri silahsızlandırılmış Ren bölgesine girdi; bu adım savaş sonrası Avrupa güvenlik düzenini daha da aşındırdı.','1936-03-07',100,'INTERNATIONAL'),
  event('de-1936-berlin-olympics','Berlin Olimpiyatları başladı','Berlin Yaz Olimpiyatları rejimin uluslararası imajını sergilediği büyük bir propaganda etkinliği olarak kullanıldı.','1936-08-01',110,'INTERNATIONAL'),
  event('de-1936-four-year-plan','Dört Yıllık Plan başlatıldı','Rejim ekonomiyi yeniden silahlanma ve savaş hazırlığı hedeflerine daha fazla yönlendiren Dört Yıllık Planı başlattı.','1936-10-18',120),
  event('de-1936-anti-comintern','Almanya ve Japonya Anti-Komintern Paktı’nı imzaladı','Almanya ile Japonya Sovyetler Birliği ve Komintern’e karşı diplomatik yakınlaşmayı kurumsallaştıran Anti-Komintern Paktı’nı imzaladı.','1936-11-25',130,'INTERNATIONAL'),
  event('de-1937-hossbach-meeting','Üst düzey dış politika ve askerî toplantı yapıldı','Hitler üst düzey askerî ve dış politika yetkilileriyle Almanya’nın genişleme hedeflerini görüştü; toplantı daha sonra Hossbach Memorandumu ile kayda geçti.','1937-11-05',140),
  event('de-1938-military-foreign-policy-reshuffle','Askerî ve dış politika yönetimi değiştirildi','Şubat 1938’de rejim askerî komuta ve dışişleri yönetiminde önemli personel değişiklikleri yaptı.','1938-02-04',150),
  event('de-1938-anschluss','Avusturya Almanya’ya katıldı','Alman birliklerinin Avusturya’ya girmesinin ardından ülke Nazi Almanyası’na ilhak edildi.','1938-03-13',160,'INTERNATIONAL'),
  event('de-1938-munich-agreement','Münih Anlaşması imzalandı','Almanya, İtalya, Birleşik Krallık ve Fransa’nın imzaladığı anlaşma Çekoslovakya’nın Sudet bölgesini Almanya’ya bırakmasını öngördü.','1938-09-29',170,'INTERNATIONAL'),
  event('de-1938-sudeten-occupation','Sudet bölgesinin devri başladı','Münih Anlaşması sonrasında Almanya Sudet bölgesini işgal etmeye başladı.','1938-10-01',180,'INTERNATIONAL'),
  event('de-1938-kristallnacht','Kasım pogromları gerçekleşti','9–10 Kasım gecesi Almanya ve ilhak edilmiş bölgelerde Yahudilere, sinagoglara ve işletmelere yönelik geniş çaplı şiddet ve tahribat gerçekleştirildi.','1938-11-09',190),
];
