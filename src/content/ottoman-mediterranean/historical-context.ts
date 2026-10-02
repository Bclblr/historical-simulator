import type { MediterraneanCardDefinition, MediterraneanChoice } from './deck';

const fx=(key:string,delta:number)=>({type:'CHANGE_VARIABLE',key,delta} as const);
const day=(days:number)=>({type:'ADVANCE_DAYS',days} as const);
const fl=(key:string)=>({type:'SET_FLAG',key,value:true} as const);
const pick=(idSuffix:string,label:string,description:string,effects:any[]):MediterraneanChoice=>({idSuffix,label,description,effects});

const seeds=[
['1560','Cerbe','Cerbe tarafından gelen haberler limanda herkesin dikkatini çekiyor.','SEA'],
['1561','Akdeniz','Cerbe sonrasında eski bağlantılar yeni haberler getiriyor.','INTELLIGENCE'],
['1565','Malta','Malta çevresinden gelen haberler limanda çoğalıyor.','INTELLIGENCE'],
['1565','Malta','Uzun süren kuşatma haberinin ardından herkes sonuçları konuşuyor.','PORT'],
['1567','Venedik','Venedikli bir tüccar ticaret yollarındaki değişiklikleri soruyor.','TRADE'],
['1568','Ragusa','Ragusalı bir aracı iki tarafın da haber kaynaklarını bildiğini söylüyor.','IDENTITY'],
['1570','Kıbrıs','Doğu Akdenizden gelen haberler daha sık konuşuluyor.','TRADE'],
['1571','İnebahtı','Büyük deniz savaşının haberi limana ulaşıyor.','INTELLIGENCE'],
['1572','İstanbul','Yeni gemilerin hazırlanacağı konuşuluyor.','PORT'],
['1573','Venedik','Ticaretin yeniden düzenleneceği konuşuluyor.','TRADE'],
['1574','Ragusa','Eski bağlantıların hâlâ işe yaradığını söyleyen bir aracı geliyor.','IDENTITY'],
['1575','Akdeniz','Eski denizciler tecrübelerini gençlere anlatıyor.','SEA'],
['1578','Cezayir','Mağribden gelen bir tüccar farklı liman çevrelerinden söz ediyor.','TRADE'],
['1579','Tunus','Farklı geçmişlerden insanların aynı çevrelerde buluştuğu anlatılıyor.','IDENTITY'],
['1580','İstanbul','Eski bilgi kayıtlarının hâlâ kullanıldığı söyleniyor.','INTELLIGENCE'],
['1581','Galata','Galatada yabancı tüccarların haberleri aynı kahvede toplanıyor.','PORT'],
['1584','Akdeniz','Bir haberci hızlı haber ile doğru haber arasında seçim yapmanı istiyor.','INTELLIGENCE'],
['1586','İstanbul','Bir kâtip aynı kişinin farklı kayıtlarda farklı göründüğünü fark ediyor.','INTELLIGENCE'],
['1590','İstanbul','Bir danışman artık tek bir kaynağa güvenmemeyi öneriyor.','INTELLIGENCE'],
['1600','İstanbul','Yılların sonunda danışmanın hangi bağlantının kaldığını soruyor.','INTELLIGENCE'],
];

const choiceLabels: Record<MediterraneanCardDefinition['category'], Array<[string, string]>> = {
  INTELLIGENCE: [
    ['Kaynağı başka bir yerden doğrularım.', 'Bu bağlantının izini sürerim.'],
    ['İkinci bir kaynağa sorarım.', 'İlk kaynağın peşine düşerim.'],
    ['Kimin çıkarına olduğunu araştırırım.', 'Haberi taşıyan kişiyi izlerim.'],
    ['Kayıtlarla karşılaştırırım.', 'Sözlü kaynağın peşine giderim.'],
    ['Önce kişiyi doğrularım.', 'Bağlantıyı kullanırım.'],
    ['İki haberi karşılaştırırım.', 'Bu haberin devamını araştırırım.'],
  ],
  TRADE: [
    ['Fiyatı başka bir tüccara sorarım.', 'Bu değişikliğin nedenini araştırırım.'],
    ['Yeni fiyatı kayıtlarla karşılaştırırım.', 'Bu fırsatı değerlendirmeyi düşünürüm.'],
    ['Ticaret yolunu kontrol ederim.', 'Bu bağlantının şartlarını sorarım.'],
    ['Başka bir tüccara danışırım.', 'Yeni pazarı takip ederim.'],
    ['Ödeme ve borcu önce hesaplarım.', 'Yeni ortakla görüşürüm.'],
    ['Şartları netleştiririm.', 'İşi büyütmeyi denerim.'],
  ],
  PORT: [
    ['Kayıtları yeniden kontrol ederim.', 'Limandaki kişileri araştırırım.'],
    ['Görevliden ayrıntı isterim.', 'Kahvedeki bağlantılara sorarım.'],
    ['Eksik kaydı tamamlatırım.', 'Kimin işine yaradığını araştırırım.'],
    ['Başka bir kayda bakarım.', 'Bu kişinin bağlantısını takip ederim.'],
    ['Liman görevlisine sorarım.', 'Haberin başka limanlara uzanıp uzanmadığını araştırırım.'],
    ['Önce limandaki durumu görürüm.', 'Bu çevreyle yeniden temas kurarım.'],
  ],
  SEA: [
    ['Rotayı bilen birine sorarım.', 'Geminin izini sürerim.'],
    ['Tayfadan başka birine danışırım.', 'Denizcinin bağlantısını araştırırım.'],
    ['Gemi kayıtlarını kontrol ederim.', 'Seferin arkasındaki kişileri sorarım.'],
    ['Yola çıkmadan önce hazırlığı kontrol ederim.', 'Bu seferin bağlantılarını araştırırım.'],
    ['Eski denizcilerin anlattıklarıyla karşılaştırırım.', 'Bu bilgiyi yeni bir sefere bağlarım.'],
    ['Önce tayfanın durumunu öğrenirim.', 'Yeni bir deniz bağlantısı kurarım.'],
  ],
  IDENTITY: [
    ['Dili ve kimliği doğrularım.', 'Bu kişinin iki çevredeki bağlantılarını sorarım.'],
    ['Kiminle konuştuğunu öğrenirim.', 'İki taraf arasındaki bağlantıyı takip ederim.'],
    ['Aracının kim olduğunu sorarım.', 'Bu ilişkinin başka ayağını araştırırım.'],
    ['Kişinin geçmişini anlamaya çalışırım.', 'Bağlantının hangi çevrelere uzandığını sorarım.'],
    ['Söylediklerini başka biriyle karşılaştırırım.', 'Bu çevrede nasıl yer edindiğini öğrenirim.'],
    ['Önce güven ilişkisini kurarım.', 'Yeni çevreyle temas ederim.'],
  ],
  FAMILY: [
    ['Evdekilerin neye ihtiyacı olduğunu sorarım.', 'Uzakta kalmanın sonuçlarını konuşurum.'],
    ['Aileyle haberleşmeyi artırırım.', 'Kendi yoluma devam ederim.'],
    ['Masrafı birlikte hesaplarım.', 'Gelirimi koruyup başka yol ararım.'],
    ['Evdekilerin haberini doğrularım.', 'Aileden başka kimlerin devreye girdiğini öğrenirim.'],
    ['Aile bağını güçlendiririm.', 'Kendi çevremi korurum.'],
    ['Eve dönmeyi değerlendiririm.', 'Uzakta kalırken destek olmayı sürdürürüm.'],
  ],
  CAPTIVITY: [
    ['Önce yaşananları dinlerim.', 'Döndüğü çevreyi anlamaya çalışırım.'],
    ['Neye ihtiyacı olduğunu sorarım.', 'Geçmişinin bugünkü hayatını nasıl etkilediğini öğrenirim.'],
    ['Ailesinin durumunu öğrenirim.', 'Yeni çevresini nasıl kurduğunu sorarım.'],
    ['Dönüşünün ardından nelerin değiştiğini sorarım.', 'Bağlantılarının bugün nerede olduğunu öğrenirim.'],
    ['Eski hayatına nasıl döndüğünü sorarım.', 'İki çevre arasında nasıl yaşadığını anlamaya çalışırım.'],
    ['Önce güvenini kazanırım.', 'Yeni hayatının nasıl kurulduğunu öğrenirim.'],
  ],
};

const variantLines = [
  ['Bunu kimden duydun?', 'Haberi ilk getiren kimmiş?', 'Başka kim aynı şeyi söylüyor?', 'Bu söz limanda nereden çıktı?', 'Bunu doğrulayan bir kayıt var mı?', 'Bu haberin peşinden gitmeli miyiz?'],
  ['Bu bağlantıyı kim kurmuş?', 'Eski tanıdıklardan biri mi?', 'Bu kişi başka kimlerle konuşuyor?', 'Limanlarda aynı isim geçiyor mu?', 'Bunu başka bir kaynaktan duydun mu?', 'Bu bağlantıya güveniyor musun?'],
  ['Malta tarafında ne konuşuluyor?', 'Bu haber ne kadar yeni?', 'Kimler bundan etkileniyor?', 'Tüccarlar ne diyor?', 'Denizciler aynı şeyi anlatıyor mu?', 'Bundan sonra ne bekliyorsun?'],
  ['Kuşatma haberinden sonra ne değişti?', 'Limanın havası nasıl?', 'Tüccarlar ne hesaplıyor?', 'Denizciler ne düşünüyor?', 'Eski haberlerle karşılaştırdın mı?', 'Şimdi ne yapmalı?'],
  ['Venedikli tüccar neden bunu soruyor?', 'Hangi yolu kastediyor?', 'Bu değişiklik kimin işine yarar?', 'Başka tüccarlar ne söylüyor?', 'Fiyatlarla ilgili bir kayıt var mı?', 'Bu bağlantıyı sürdürmeli miyiz?'],
  ['Ragusalı aracı kimi tanıyor?', 'İki tarafla da konuşuyor mu?', 'Bu bağlantının kaynağı ne?', 'Başka bir aracı biliyor musun?', 'Söylediklerini kim doğrulayabilir?', 'Bu kişiye ne kadar güvenilir?'],
  ['Doğudan gelen haber nereden geliyor?', 'Aynı haberi kimler anlatıyor?', 'Ticaret bunu nasıl etkiler?', 'Limanlarda ne konuşuluyor?', 'Haberi başka nereden kontrol ederiz?', 'Bu gelişmenin devamı ne olabilir?'],
  ['İnebahtı haberini ilk kim getirdi?', 'Haber doğru mu?', 'Liman halkı ne konuşuyor?', 'Denizciler nasıl karşılıyor?', 'Başka bir kaynağa bakalım mı?', 'Bundan sonra ne değişebilir?'],
  ['Yeni gemiler hakkında ne duydun?', 'Bu hazırlık nerede konuşuluyor?', 'Kimler bundan söz ediyor?', 'Tüccarlar ne bekliyor?', 'Eski kayıtlarla karşılaştırmalı mıyız?', 'Bu haberin peşinden gidelim mi?'],
  ['Ticaret yeniden nasıl düzenlenecek?', 'Venedikli tüccarlar ne diyor?', 'Ragusa üzerinden ne geliyor?', 'Limanlarda fiyatlar değişti mi?', 'Başka kaynak var mı?', 'Bu yeni düzene uyum sağlayabilir miyiz?'],
  ['Eski bağlantı nasıl ortaya çıktı?', 'Bu kişi seni nereden tanıyor?', 'Kimlerle görüşüyor?', 'Bağlantının başka ayağı var mı?', 'Söylediklerini kontrol edelim mi?', 'Bu ilişkiyi sürdürmek ister misin?'],
  ['Eski denizciler ne anlatıyor?', 'Hangi tecrübeyi kastediyorlar?', 'Gençler onları dinliyor mu?', 'Bu bilgiyi kimler kullanıyor?', 'Anlatılanları başka biri doğruluyor mu?', 'Sen ne öğrendin?'],
  ['Mağribden gelen tüccar ne anlatıyor?', 'Hangi limanlardan söz ediyor?', 'Bu bağlantılar nerede kesişiyor?', 'Ticaret haberleri nasıl geliyor?', 'Başka bir tüccara soralım mı?', 'Bu ağın içine girmek ister misin?'],
  ['Tunusta kimler buluşuyor?', 'Farklı geçmişler nasıl bir araya geliyor?', 'Bu çevreyi kim yönetiyor?', 'Aracılar ne konuşuyor?', 'Söylentiyi doğrulayabilir miyiz?', 'Bu çevrede yer almak ister misin?'],
  ['Eski kayıt neden hâlâ kullanılıyor?', 'Bu kaydı kim tutmuş?', 'Aynı isim başka yerde geçiyor mu?', 'Kayıtla sözlü haber uyuşuyor mu?', 'Başka bir belge bulabilir miyiz?', 'Bunu daha fazla araştırmalı mıyız?'],
  ['Galatada bu haberleri kim topluyor?', 'Kahvede kimler konuşuyor?', 'Yabancı tüccarlar ne anlatıyor?', 'Aynı haber başka limanda da var mı?', 'Bir kaynağı daha kontrol edelim mi?', 'Bu çevreye tekrar gelelim mi?'],
  ['Hızlı haber neden önemli?', 'Doğru haber ne kadar gecikir?', 'Kimden doğrulayacağız?', 'Yanlış çıkarsa ne olur?', 'İki kaynağı karşılaştıralım mı?', 'Hangisine daha çok güveniyorsun?'],
  ['Aynı kişi neden farklı görünüyor?', 'Kayıtlarda hangi isim kullanılmış?', 'Bu bir hata olabilir mi?', 'Başka bir kayıt var mı?', 'Kişinin kendisine soralım mı?', 'Kimlik meselesini araştırmalı mıyız?'],
  ['Neden tek kaynağa güvenmeyelim?', 'Hangi kaynakları karşılaştıracağız?', 'Birbiriyle çelişen haber var mı?', 'Bu bilgiyi kim doğrulayabilir?', 'Kayıtları da inceleyelim mi?', 'Artık nasıl ilerlemeli?'],
  ['Yıllar içinde hangi bağlantı kaldı?', 'Kim hâlâ seni hatırlıyor?', 'Hangi haber ağı ayakta kaldı?', 'Aileden kim yanında?', 'Eski kayıtların hangisi işe yarıyor?', 'Bundan sonra neyi sürdürmek istiyorsun?'],
];

export const HISTORICAL_CONTEXT_CARDS: MediterraneanCardDefinition[]=seeds.flatMap(([year,place,line,category],i)=>Array.from({length:6},(_,j)=>({
 id:`med-context-${i+1}-${j+1}`,
role:`${place} çevresinden biri`,
 line: `${line} ${variantLines[i][j]}`,
 speaker: j % 2 === 0 ? 'Bir haberci' : 'Bir tanıdık',
 category:category as MediterraneanCardDefinition['category'],
 minDate:`${year}-01-01`,
 weight:8,
 left:pick('context-left',choiceLabels[category as MediterraneanCardDefinition['category']][j][0],'Soruyu doğrudan araştır ve kaynağı sınamaya çalış.',[fx('information',3),fx('reputation',1),day(60),fl(`context_${i}_${j}_a`)]),
 right:pick('context-right',choiceLabels[category as MediterraneanCardDefinition['category']][j][1],'Bağlantının peşine düş ve yeni bir kaynak edin.',[fx('social',2),fx('intelligenceNetwork',3),fx('safety',-1),day(70),fl(`context_${i}_${j}_b`)]),
})));

export const HISTORICAL_CONTEXT_CARD_COUNT=HISTORICAL_CONTEXT_CARDS.length;
