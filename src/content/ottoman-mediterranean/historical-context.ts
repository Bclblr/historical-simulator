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

export const HISTORICAL_CONTEXT_CARDS: MediterraneanCardDefinition[]=seeds.flatMap(([year,place,line,category],i)=>Array.from({length:6},(_,j)=>({
 id:`med-context-${i+1}-${j+1}`,
 speaker:j%2===0?'Bir haberci':'Bir tanıdık',
 role:'Tarihsel çevreden biri',
 line,
 category:category as MediterraneanCardDefinition['category'],
 minDate:`${year}-01-01`,
 maxDate:`${year}-12-31`,
 weight:8,
 left:pick('verify','Önce başka bir kaynağa bakalım.','Haberi karşılaştırarak ilerle.',[fx('information',3),fx('reputation',1),day(60),fl(`context_${i}_${j}_a`)]),
 right:pick('follow','Bana biraz daha anlat.','Bu bağlantının peşinden git.',[fx('social',2),fx('intelligenceNetwork',3),fx('safety',-1),day(70),fl(`context_${i}_${j}_b`)]),
})));

export const HISTORICAL_CONTEXT_CARD_COUNT=HISTORICAL_CONTEXT_CARDS.length;
