import type { MediterraneanCardDefinition, MediterraneanChoice } from './deck';

const c=(idSuffix:string,label:string,description:string,effects:any[]):MediterraneanChoice=>({idSuffix,label,description,effects});
const change=(key:string,delta:number)=>({type:'CHANGE_VARIABLE',key,delta} as const);
const days=(n:number)=>({type:'ADVANCE_DAYS',days:n} as const);
const flag=(key:string)=>({type:'SET_FLAG',key,value:true} as const);

const directReplyByTopic = (topic:number, side:0|1) => {
  const replies: Array<[string,string]> = [
  [
    "Bu işaretin anlamını seninle birlikte çözmek istiyorum.",
    "Bunu başka bir kayıtta da kontrol edeceğim; içim rahat etsin."
  ],
  [
    "Fiyatın neden değiştiğini birlikte anlamaya çalışalım.",
    "Ben önce kimin kazandığına bakacağım; sonra karar veririz."
  ],
  [
    "Sözün asıl anlamını bana anlat; yanlış anlamak istemiyorum.",
    "Bir tercüman daha dinleyelim, sonra karar veririz."
  ],
  [
    "Kayıttaki eksikliği bana göster; belki iz oradadır.",
    "Neden değiştirildiğini anlamadan bu kayda güvenemem."
  ],
  [
    "Gittiğin limanda ne duyduysan baştan anlat.",
    "Ben de başka bir yolcudan dinleyip karşılaştıracağım."
  ],
  [
    "Denizde ne gördüğünü anlat; seni dinliyorum.",
    "Bu haberi başka bir denizciden de doğrulayacağım."
  ],
  [
    "İki kaynağı da dinleyelim; acele etmeyelim.",
    "Ben ikisini karşılaştırmadan birine güvenmem."
  ],
  [
    "Beni tanıştıracağın tüccarın şartlarını anlat.",
    "Önce senin ona neden güvendiğini bilmek istiyorum."
  ],
  [
    "Eski kaydı birlikte inceleyelim; belki aradığımız iz orada.",
    "İsmi başka bir kaynaktan da kontrol edeceğim."
  ],
  [
    "Benden ne öğrenmek istediklerini açıkça söyle.",
    "Kimlerle görüştüğümü anlatmayacağım; bunu sen de bilirsin."
  ],
  [
    "Baktığım kaynakları sana anlatırım ama hepsini açmam.",
    "Önce senin hangi kaynaklara güvendiğini bilmek istiyorum."
  ],
  [
    "Beni görüştüreceğin kişiyi anlat; yabancı değilse konuşuruz.",
    "Önce bu kişinin neden önemli olduğunu anlamak istiyorum."
  ],
  [
    "Evdekilerin neye ihtiyacı olduğunu anlat; elimden geleni yaparım.",
    "Onlara haber göndermenin güvenli bir yolunu bulalım."
  ],
  [
    "Limanın ne konuştuğunu anlat; aramızda kalsın.",
    "Söylenti büyümeden kaynağını bulmak daha iyi."
  ],
  [
    "Haberin kime gideceğini söyle; yolu ona göre seçelim.",
    "Mesajın kimlerin elinden geçeceğini bilmeden taşıyamam."
  ],
  [
    "Malın gerçek değerini ve değişen fiyatı birlikte hesaplayalım.",
    "Bu alışverişin kime yaradığını anlamadan el sıkışmam."
  ],
  [
    "Rotanın neden uzadığını anlat; tayfayı da düşünelim.",
    "Önce gemiyi ve tayfayı göreyim, sonra karar verelim."
  ],
  [
    "Mektubun kimden geldiğini anlat; belki yardımcı olurum.",
    "Başka bir göz de okusun; sonra yanlış anlamayalım."
  ],
  [
    "Haberi kime ulaştıracağımızı birlikte kararlaştıralım.",
    "Önce haberin değerini ve riskini anlayalım."
  ],
  [
    "Kayıtla haber arasındaki farkı göster; beraber bakalım.",
    "Hangisinin eski olduğunu bulmadan ilerlemeyelim."
  ],
  [
    "Ragusa bağlantısının ne getirdiğini anlat; merak ettim.",
    "Ben bunu başka bir tüccardan da doğrulayacağım."
  ],
  [
    "İki yolcunun geçmişini ayrı ayrı dinleyelim.",
    "Aralarındaki meseleyi bilmeden taraf tutmayacağım."
  ],
  [
    "Benden ne öğrenmek istediklerini açıkça söyleyin.",
    "Önce neden sorduklarını bilmek istiyorum."
  ],
  [
    "Evdekilerin neden beklediğini anlat; onları merakta bırakmayalım.",
    "Onlara güvenli bir haber göndermenin yolunu bulacağım."
  ],
  [
    "Limanda gördüklerini anlat; ayrıntılar önemli.",
    "Bu bilgiyi kiminle paylaşacağımı dikkatle seçeceğim."
  ],
  [
    "Mektubun neden geciktiğini anlat; zamanlaması önemli.",
    "Doğruluğunu gecikmeden bağımsız olarak kontrol edeceğim."
  ],
  [
    "İki tarafın da şartlarını anlat; ikisini de dinleyelim.",
    "Önce ne istediklerini bilmeden aralarına girmem."
  ],
  [
    "Eski bağlantının neden döndüğünü anlat; geçmişi unutmadım.",
    "Yeniden güvenmeden önce ne değiştiğini öğrenmek istiyorum."
  ],
  [
    "Hangi haberi doğruladığını söyle; gerisini beraber ayıklarız.",
    "Ben tek bir söze güvenmeden önce kaynakları karşılaştıracağım."
  ]
];
  return replies[topic % replies.length][side];
};

const topics=[
['Bir kâtip','Yazıcı','Bu işaretin ne anlama geldiğini sen de biliyor musun?','INTELLIGENCE','information','language'],
['Bir tüccar','Tüccar','Bu fiyat değişikliğinin sebebini duydun mu?','TRADE','money','merchantNetwork'],
['Bir tercüman','Tercüman','Bu sözü başka türlü de çevirebilir miyiz?','IDENTITY','language','information'],
['Bir kayıt görevlisi','Kâtip','Şu kayıtta bir eksik var. Sence neden?','PORT','information','reputation'],
['Bir yolcu','Yolcu','Gittiğim limanda herkes başka bir şey söylüyordu.','INTELLIGENCE','information','social'],
['Bir denizci','Denizci','Denizde duyduğum haberi burada da duydum.','SEA','sailorNetwork','information'],
['Bir aracı','Aracı','İki kişi aynı haberi farklı anlatıyor. Hangisine bakalım?','INTELLIGENCE','information','reputation'],
['Bir komisyoncu','Aracı','Seni başka bir tüccarla tanıştırabilirim.','TRADE','merchantNetwork','social'],
['Bir kâtip','Kayıt görevlisi','Eski bir kayıtta bugün işimize yarayacak bir iz var.','PORT','information','reputation'],
['Bir görevli','Görevli','Sana gelen haberin kaynağını da bilmek isteriz.','INTELLIGENCE','safety','intelligenceNetwork'],
['Bir danışman','Danışman','Bir karar vermeden önce kaç kaynağa baktın?','INTELLIGENCE','information','reputation'],
['Bir ziyaretçi','Ziyaretçi','Burada kiminle görüşmem gerektiğini söyleyebilir misin?','IDENTITY','social','reputation'],
['Bir aile büyüğü','Aileden biri','Evdekiler senden haber bekliyor.','FAMILY','familyTies','social'],
['Bir liman sakini','Tanıdık','Son günlerde limanda çok şey konuşuluyor.','PORT','information','social'],
['Bir haberci','Haberci','Bu haberi kime ulaştırmamı istersin?','INTELLIGENCE','intelligenceNetwork','reputation'],
['Bir tüccar','Tüccar','Bir malın fiyatı değiştiğinde herkes başka sebep söylüyor.','TRADE','money','information'],
['Bir denizci','Denizci','Yol uzadı. Sence şimdi ne yapmalıyız?','SEA','safety','sailorNetwork'],
['Bir mütercim','Mütercim','Bu mektubu kimlerin okuyabileceğini düşünüyorsun?','IDENTITY','language','safety'],
['Bir aracı','Aracı','Bir haberin değeri, kime ulaştığına göre değişiyor.','INTELLIGENCE','information','social'],
['Bir kâtip','Kâtip','Eski kayıtlarla yeni haber birbirini tutmuyor.','PORT','information','safety'],
['Bir tüccar','Tüccar','Ragusa üzerinden gelen haber sana da ulaştı mı?','TRADE','merchantNetwork','information'],
['Bir yolcu','Yolcu','Aynı şehirden gelen iki kişi birbirini tanımıyor.','IDENTITY','language','social'],
['Bir görevli','Görevli','Bugün senden yalnızca bir şey öğrenmek istiyorum.','INTELLIGENCE','safety','information'],
['Bir aileden biri','Aile çevresi','Bu kadar uzun süre uzakta kalmak zorunda mısın?','FAMILY','familyTies','safety'],
['Bir liman işçisi','Liman işçisi','Burada olan biteni en çok biz görüyoruz.','PORT','portReputation','information'],
['Bir yazıcı','Yazıcı','Mektup gecikirse haberin değeri de değişir.','INTELLIGENCE','language','information'],
['Bir komisyoncu','Komisyoncu','İki tarafı da tanıyorum. İstersen seni tanıştırayım.','TRADE','merchantNetwork','reputation'],
['Bir denizci','Denizci','Döndüğüm limanda herkes yeni bir haber bekliyordu.','SEA','sailorNetwork','information'],
['Bir tanıdık','Tanıdık','Eski bağlantılarından biri yeniden ortaya çıktı.','INTELLIGENCE','social','intelligenceNetwork'],
['Bir danışman','Danışman','Bazen en önemli karar, hangi haberi dikkate alacağını seçmektir.','INTELLIGENCE','information','reputation'],
];

const questionSets: Record<MediterraneanCardDefinition['category'], Array<[string, string]>> = {
  INTELLIGENCE: [
    ['Bunu kimden duydun?', 'Bir kaynağı daha kontrol edelim mi?'],
    ['Bu haber ne kadar yeni?', 'Bunu başka kim doğruluyor?'],
    ['Bu kişinin bağlantısı kim?', 'Kimlerle görüştüğünü biliyor musun?'],
    ['Bunu kayıtlarda bulabilir miyiz?', 'Eski haberlerle karşılaştırayım mı?'],
    ['Benden ne bekliyorsun?', 'Bunu neden bana anlatıyorsun?'],
    ['Bu bilginin bedeli ne?', 'Karşılığında ne istiyorsun?'],
    ['Bunu kimlerin bilmesi gerekiyor?', 'Bu haberi kimden saklayalım?'],
    ['Başka limanlarda da böyle mi?', 'Aynı haberi başka yerde duydun mu?'],
    ['Şimdi ne yapmamı bekliyorsun?', 'Önce biraz daha bekleyelim mi?'],
    ['Buna güvenmeli miyim?', 'Sen olsan neyi kontrol ederdin?'],
  ],
  TRADE: [
    ['Fiyat neden değişti?', 'Bu değişiklikten kim kazanıyor?'],
    ['Bu malı nereden bulacağız?', 'Bu işten ne kadar kazanacağım?'],
    ['Borcu ne zaman kapatacağız?', 'Yeni bir borca girmeli miyiz?'],
    ['Bu tüccara ne kadar güveniyorsun?', 'Başka bir ortak bulalım mı?'],
    ['Hangi liman daha kazançlı?', 'Bu rotanın riski ne?'],
    ['Bu haber ticareti nasıl etkiler?', 'Beklemek daha mı doğru?'],
    ['Bu bağlantının karşılığı ne?', 'Benden ne bekliyorsun?'],
    ['Hesabı kim tutuyor?', 'Kayıtları tekrar kontrol edelim mi?'],
    ['Bu işi tek başına mı yürütüyorsun?', 'Başka kim bu işin içinde?'],
    ['Şimdi alıp bekleyelim mi?', 'Önce piyasayı biraz daha izleyelim mi?'],
  ],
  IDENTITY: [
    ['Bu sözün asıl anlamı ne?', 'Bunu kim doğrulayabilir?'],
    ['Bu dili nerede öğrendin?', 'Bana da öğretebilir misin?'],
    ['Bu kişi seni nereden tanıyor?', 'Aranızdaki bağ ne?'],
    ['İki tarafla da konuşuyor musun?', 'Bir tarafı seçmek zorunda mıyız?'],
    ['Bunu nasıl çevirelim?', 'Sözün bağlamını da öğrenelim mi?'],
    ['Bu çevrede sana kim güveniyor?', 'Benim için kimi tanıştırabilirsin?'],
    ['Geçmişini ne kadar anlatmak istiyorsun?', 'Bugünkü hayatın nasıl değişti?'],
    ['Bu bağlantıyı ne kadar sürdürebiliriz?', 'Mesafeyi korumak daha mı güvenli?'],
    ['Beni hangi çevreye sokuyorsun?', 'Bu çevrede kim söz sahibi?'],
    ['İki dünyanın arasında kalmak zor mu?', 'Yeni hayatını nasıl kurdun?'],
  ],
  PORT: [
    ['Kayıtta ne eksik?', 'Bu kaydı neden değiştirelim?'],
    ['Limanda ne gördün?', 'Bunu kimlerle paylaşmalıyım?'],
    ['Bu yük neden bekliyor?', 'Kimden izin almamız gerekiyor?'],
    ['Kimler bugün limana geldi?', 'Giriş kayıtlarını kontrol edelim mi?'],
    ['Bu haber limanda kimleri etkiler?', 'Önce sessizce araştıralım mı?'],
    ['Adım neden kayıtlarda geçiyor?', 'Görünürlüğümü azaltmalı mıyım?'],
    ['Bu yük kime ait?', 'Sahibini nasıl doğrulayacağız?'],
    ['Limandaki söylenti nereden çıktı?', 'Başka bir kaynağa soralım mı?'],
    ['Bu iş için kimden yardım alabiliriz?', 'Tek başımıza ilerlemek daha mı güvenli?'],
    ['Bugün limanda ne değişti?', 'Dünle karşılaştırabilir miyiz?'],
  ],
  SEA: [
    ['Bu gemi nereye gidiyor?', 'Bu bilgiyi sana kim verdi?'],
    ['Seferde ne eksik?', 'Neden şimdi yola çıkalım?'],
    ['Tayfa ne düşünüyor?', 'Kaptanla tekrar konuşalım mı?'],
    ['Bu yolculuk ne kadar sürecek?', 'Karada kalmak daha mı güvenli?'],
    ['Hangi limanda duracağız?', 'Rotayı değiştirmek gerekir mi?'],
    ['Denizde ne gördün?', 'Başka denizciler de bunu anlattı mı?'],
    ['Tayfaya kim güveniyor?', 'Aralarında sorun mu var?'],
    ['Yol uzarsa ne yapacağız?', 'Erzakı yeniden hesaplayalım mı?'],
    ['Bu gemide kimin sözü geçiyor?', 'Kaptanla açıkça konuşalım mı?'],
    ['Bir sonraki sefer ne zaman?', 'Bu kez karada kalmalı mıyım?'],
  ],
  FAMILY: [
    ['Evdekiler benden ne bekliyor?', 'Daha ne kadar uzak kalacağım?'],
    ['Aileye ne kadar gönderebilirim?', 'Önce kendi geçimimizi mi düşünelim?'],
    ['Ne zaman eve döneceğim?', 'Biraz daha burada kalmam gerekir mi?'],
    ['Evdekiler bu haberi biliyor mu?', 'Onları bu işten uzak tutmalı mıyım?'],
    ['Aile bağlarını nasıl koruyacağız?', 'Bu hayatı sürdürmek aileyi zorlar mı?'],
    ['Benden neden haber bekliyorlar?', 'Onlara şimdi dönmek mümkün mü?'],
    ['Bu yolculuk aileyi nasıl etkiler?', 'Başka bir çözüm bulabilir miyiz?'],
    ['Aileden kim bu işi biliyor?', 'Bunu evde konuşmalı mıyız?'],
    ['Yerleşmemi gerçekten istiyor musunuz?', 'Denize dönmem sorun olur mu?'],
    ['Şimdi ne yapmamı istersiniz?', 'Biraz daha zaman verebilir misiniz?'],
  ],
  CAPTIVITY: [
    ['Nerede kaldın?', 'Orada kimlerle konuştun?'],
    ['Döndüğünde ne öğrendin?', 'Geçmişini neden anlatıyorsun?'],
    ['Ailen seni nasıl karşıladı?', 'Yeniden hayata alışmak zor mu?'],
    ['Bu haber nereden geliyor?', 'Başka bir esir de bunu anlattı mı?'],
    ['Sana kim yardım etti?', 'Hâlâ o insanlarla bağlantın var mı?'],
    ['Masrafları nasıl karşılayacaksınız?', 'Yardım için kimlere güveniyorsunuz?'],
    ['Bu deneyim seni nasıl değiştirdi?', 'Bunu konuşmak ister misin?'],
    ['Hangi limanlardan geçtin?', 'Oradaki insanları hatırlıyor musun?'],
    ['Şimdi neye ihtiyacın var?', 'Sana nasıl yardımcı olabiliriz?'],
    ['Eski hayatına dönmek mümkün mü?', 'Yeni bir çevre kurmak mı daha kolay?'],
  ],
};

const placeHints = ['Galata','İstanbul','Ragusa','Venedik','Cezayir','Tunus','Cerbe','Malta','Kıbrıs','İskenderiye'];

export const EXTRA_MEDITERRANEAN_CARDS: MediterraneanCardDefinition[]=topics.flatMap(([speaker,role,line,category,a,b],i)=>Array.from({length:10},(_,j)=>({
 id:`med-extra-${i+1}-${j+1}`,speaker,role,line:`${line} ${placeHints[(i+j)%placeHints.length]}.`,category:category as MediterraneanCardDefinition['category'],weight:4+(j%6),
 left:c('hold',directReplyByTopic(i,0),'Bilgiyi sınayarak ilerle.',[change(a,2+(j%3)),days(40+(j%4)*20)]),
 right:c('answer',directReplyByTopic(i,1),'Konuşmayı sürdür ve yeni bir bağlantı kur.',[change(b,3+(j%4)),change('safety',-1),flag(`extra_${i+1}_${j+1}`),days(50+(j%5)*20)]),
})));

export const EXTRA_MEDITERRANEAN_CARD_COUNT=EXTRA_MEDITERRANEAN_CARDS.length;
