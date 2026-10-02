import type { MediterraneanCardDefinition, MediterraneanChoice } from './deck';

const c=(idSuffix:string,label:string,description:string,effects:any[]):MediterraneanChoice=>({idSuffix,label,description,effects});
const change=(key:string,delta:number)=>({type:'CHANGE_VARIABLE',key,delta} as const);
const days=(n:number)=>({type:'ADVANCE_DAYS',days:n} as const);
const flag=(key:string)=>({type:'SET_FLAG',key,value:true} as const);

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

export const EXTRA_MEDITERRANEAN_CARDS: MediterraneanCardDefinition[]=topics.flatMap(([speaker,role,line,category,a,b],i)=>Array.from({length:10},(_,j)=>({
 id:`med-extra-${i+1}-${j+1}`,speaker,role,line,category:category as MediterraneanCardDefinition['category'],weight:4+(j%6),
 left:c('hold','Önce bunu doğrulayalım.','Bilgiyi sınayarak ilerle.',[change(a,2+(j%3)),days(40+(j%4)*20)]),
 right:c('answer','Bunu biraz daha anlatsana.','Konuşmayı sürdür ve yeni bir bağlantı kur.',[change(b,3+(j%4)),change('safety',-1),flag(`extra_${i+1}_${j+1}`),days(50+(j%5)*20)]),
})));

export const EXTRA_MEDITERRANEAN_CARD_COUNT=EXTRA_MEDITERRANEAN_CARDS.length;
