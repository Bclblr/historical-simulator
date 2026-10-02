import type { MediterraneanCardDefinition, MediterraneanChoice } from './deck';

const change = (key: string, delta: number) => ({ type: 'CHANGE_VARIABLE', key, delta } as const);
const flag = (key: string) => ({ type: 'SET_FLAG', key, value: true } as const);
const days = (n: number) => ({ type: 'ADVANCE_DAYS', days: n } as const);

const makeChoice = (idSuffix: string, label: string, description: string, effects: any[]): MediterraneanChoice => ({
  idSuffix,
  label,
  description,
  effects,
});

const asReply=(side:0|1)=>side===0?'Bunu biraz daha aç; seni dinliyorum.':'Seni anlıyorum ama önce içimin rahat etmesini istiyorum.';

const sceneReplies: Array<[string,string]> = [
  [
    "Mektubu kimin gönderdiğini bana anlat; seni zor durumda bırakmak istemem.",
    "Bunu doğrulamadan taşıyamam; kusura bakma, önce içim rahat etsin."
  ],
  [
    "Tüccarın senden ne istediğini anlat; belki birlikte bir yol buluruz.",
    "Ona hemen güvenemem; önce senin neden ona güvendiğini bilmek isterim."
  ],
  [
    "Fiyatın neden değiştiğini anlat; hesabı beraber çıkaralım.",
    "Bundan kimin kazandığını anlamadan karar vermeyeyim."
  ],
  [
    "Bu haberi kim doğrulayabilir, birlikte düşünelim.",
    "Bunu başkasından da dinlemek istiyorum; yanlış anlaşılmasın."
  ],
  [
    "Benden ne istediklerini açıkça anlat; ona göre konuşalım.",
    "Bu işin bana ait olup olmadığını anlamadan söz vermeyeyim."
  ],
  [
    "Gecikmenin sebebini birlikte bulalım.",
    "Ne kadar bekleyeceğimizi bilmeden tayfayı oyalamayalım."
  ],
  [
    "Kayıdın neden kaybolduğunu anlat; belki izi başka yerde buluruz.",
    "Bunun benimle ilgisi varsa önce açıkça bilmek isterim."
  ],
  [
    "Döndüğünde neler yaşadığını anlat; seni dinlerim.",
    "Hazır değilsen anlatma; ama söylediklerini doğrulamadan da hareket etmeyeyim."
  ],
  [
    "Beni kimlerle tanıştıracağını anlat; insanını bilmek isterim.",
    "Bu insanlara güvenmek için biraz daha zamana ihtiyacım var."
  ],
  [
    "Nelerin eksik olduğunu birlikte çıkaralım.",
    "Tayfa hazır olmadan yola çıkmak istemiyorum."
  ],
  [
    "İlk haberi kim verdiğini anlat; izini oradan sürelim.",
    "Buna hemen inanmayalım; önce başka bir kaynaktan dinleyelim."
  ],
  [
    "Borcu nasıl kapatabileceğimizi konuşalım; seni de zor durumda bırakmak istemem.",
    "Yeni bir işe girmeden önce şartları açıkça görelim."
  ],
  [
    "Benden ne öğrenmek istediklerini anlat; gerisini ben düşünürüm.",
    "Bunu sana anlatamam; kimlerle görüştüğümü korumam gerekiyor."
  ],
  [
    "Yeni habercinin kim olduğunu anlat; yüzünü bilmek isterim.",
    "Güvenmeden önce geçmişini biraz araştıralım."
  ],
  [
    "Gecikmenin sebebini bulalım; belki yük hâlâ kurtarılabilir.",
    "Bu işe karışmadan önce ne kadar risk aldığımızı bilmek istiyorum."
  ],
  [
    "Evdekilerin neden beklediğini anlat; onları daha fazla merakta bırakmayalım.",
    "Daha ne kadar kalacağımı bilmiyorum ama onlara bir haber göndereceğim."
  ],
  [
    "Neden geri çekilmem gerektiğini anlat; dostça uyarıyorsan dinlerim.",
    "Beni kim izliyorsa önce onu anlamak istiyorum."
  ],
  [
    "Ne kadar erzak gerektiğini birlikte hesaplayalım.",
    "Bu kadar erzağın neden gerektiğini bilmeden masrafa girmeyelim."
  ]
];
const replyForScene = (index:number, side:0|1) => sceneReplies[index % sceneReplies.length][side];


const scenes = [
  ['şifreli bir mektup', 'Mektubu sana ulaştıran aracı, içeriğini bilmediğini söylüyor.', 'information', 'intelligenceNetwork'],
  ['bir Venedik tüccarının haberi', 'Tüccar, limana gelen gemiler hakkında senden fikir istiyor.', 'merchantNetwork', 'information'],
  ['limandaki fiyat değişikliği', 'Bir malın fiyatı kısa sürede değişmiş; bunun tesadüf olmadığını düşünenler var.', 'money', 'merchantNetwork'],
  ['yabancı bir denizcinin anlattıkları', 'Denizci, başka bir limanda duyduğu haberin doğru olup olmadığını soruyor.', 'sailorNetwork', 'language'],
  ['bir elçinin aracısı', 'Aracı, farklı çevreler arasında güvenilir bir haber taşıyıcısı arıyor.', 'intelligenceNetwork', 'reputation'],
  ['gümrükteki gecikme', 'Bir yük günlerdir bekletiliyor; herkes başka bir sebep anlatıyor.', 'safety', 'information'],
  ['kaybolan bir kayıt', 'Liman kayıtlarından birinin ortadan kalktığı söyleniyor.', 'information', 'reputation'],
  ['eski bir esirin dönüşü', 'Yıllar sonra dönen bir denizci, iki dünya arasında sıkışmış hayatını anlatıyor.', 'social', 'familyTies'],
  ['mühtedi bir denizcinin teklifi', 'Yeni hayat kurmuş bir denizci, seni farklı çevrelerle tanıştırabileceğini söylüyor.', 'language', 'social'],
  ['bir gemi hazırlığı', 'Yeni sefer için erzak, tayfa ve para hesabı yeniden yapılıyor.', 'safety', 'money'],
  ['limanda yayılan söylenti', 'Aynı olay hakkında üç farklı anlatı dolaşıyor.', 'information', 'reputation'],
  ['bir borç hesabı', 'Eski bir ticaret borcu yeniden önüne geliyor.', 'money', 'merchantNetwork'],
  ['karşı tarafın soruları', 'Bir görevli, son dönemde kimlerle görüştüğünü öğrenmek istiyor.', 'safety', 'intelligenceNetwork'],
  ['bir aracı değişikliği', 'Haber taşıyan kişinin yerine başka birinin geçmesi gerekiyor.', 'reputation', 'information'],
  ['kaçak bir ticaret haberi', 'Bir yükün resmî kayıtlara girmeden el değiştirdiği konuşuluyor.', 'money', 'safety'],
  ['aileden gelen çağrı', 'Evdekiler uzun süredir senden haber bekliyor.', 'familyTies', 'social'],
  ['liman otoritesinin uyarısı', 'Adının kayıtlarda daha sık geçmeye başladığı söyleniyor.', 'safety', 'reputation'],
  ['uzun bir deniz yolculuğu', 'Yolculuk uzadıkça tayfanın sabrı ve erzak hesabı önem kazanıyor.', 'sailorNetwork', 'safety'],
];


const dialogues = [
  "Bir mektup getirdim. Bana veren kişi adını söylemedi; belli ki adını gizlemek için sebebi var.",
  "Venedikli tüccar seni soruyor. Limandaki gemilerden ve fiyatlardan söz etti; seni tanıdığı belli.",
  "Bu malın fiyatı bir gecede değişti. Limandaki insanlar bunun arkasında başka bir hesap olduğunu düşünüyor.",
  "Yabancı bir denizci başka bir limandan haber getirdi. Buradaki anlatılanlarla bazı yerleri uyuşuyor.",
  "Bir elçinin aracısı güvenilir bir haberci arıyor. Seni önermemin nedeni, adını bilen insanların olması.",
  "Bu yük günlerdir gümrükte bekliyor. Herkes başka bir sebep anlatıyor; ben de işin aslını anlamaya çalışıyorum.",
  "Bir liman kaydı ortadan kaybolmuş. Bunu yapan kişi iz bırakmamaya çalışmış ama bir boşluk göze çarpıyor.",
  "Esaretten dönen biri seni görmek istiyor. Uzun zamandır taşıdığı bazı şeyleri ilk kez anlatmaya hazır.",
  "Farklı çevrelerden insanları tanıyorum. Seni onlarla tanıştırabilirim; ama bu çevrede herkes birbirine aynı ölçüde güvenmiyor.",
  "Yeni bir sefer hazırlanıyor. Erzak, tayfa ve para hesabında birkaç eksik var; yola çıkmadan önce bunları görmek gerek.",
  "Aynı olay hakkında üç farklı anlatı duyduk. Üçünün de içinde doğru bir parça olabilir.",
  "Eski borcun hâlâ duruyor. Seni sıkıştırmak istemem; ama ikimizin de bu hesabı temizlemesi gerekiyor.",
  "Kimlerle görüştüğünü öğrenmek isteyenler var. Bunu sana söylememin nedeni seni dostça uyarmak.",
  "Eski haberci artık çalışmıyor. Yerine geçecek kişinin güvenilir olması gerekiyor.",
  "Bir yük kayıtlara girmeden el değiştirmiş. Limanda bunu fark eden birkaç kişi var ama kimse açıkça konuşmuyor.",
  "Evdekiler senden uzun zamandır haber bekliyor. Meryem özellikle sessizliğine içerliyor.",
  "Adın kayıtlarda fazla görünmeye başladı. Henüz ciddi bir şey yok ama biraz daha dikkatli olmak iyi olur.",
  "Yol uzayacak. Erzakı şimdi tamamlamazsak dönüşte tayfayı zor durumda bırakabiliriz."
];
const decisionPairs: Array<[string, string]> = [
  [
    "Mektubu kimin gönderdiğini bana anlat; seni zor durumda bırakmak istemem.",
    "Bunu doğrulamadan taşıyamam; kusura bakma, önce içim rahat etsin."
  ],
  [
    "Tüccarın senden ne istediğini anlat; belki birlikte bir yol buluruz.",
    "Ona hemen güvenemem; önce senin neden ona güvendiğini bilmek isterim."
  ],
  [
    "Fiyatın neden değiştiğini anlat; hesabı beraber çıkaralım.",
    "Bundan kimin kazandığını anlamadan karar vermeyeyim."
  ],
  [
    "Bu haberi kim doğrulayabilir, birlikte düşünelim.",
    "Bunu başkasından da dinlemek istiyorum; yanlış anlaşılmasın."
  ],
  [
    "Benden ne istediklerini açıkça anlat; ona göre konuşalım.",
    "Bu işin bana ait olup olmadığını anlamadan söz vermeyeyim."
  ],
  [
    "Gecikmenin sebebini birlikte bulalım.",
    "Ne kadar bekleyeceğimizi bilmeden tayfayı oyalamayalım."
  ],
  [
    "Kayıdın neden kaybolduğunu anlat; belki izi başka yerde buluruz.",
    "Bunun benimle ilgisi varsa önce açıkça bilmek isterim."
  ],
  [
    "Döndüğünde neler yaşadığını anlat; seni dinlerim.",
    "Hazır değilsen anlatma; ama söylediklerini doğrulamadan da hareket etmeyeyim."
  ],
  [
    "Beni kimlerle tanıştıracağını anlat; insanını bilmek isterim.",
    "Bu insanlara güvenmek için biraz daha zamana ihtiyacım var."
  ],
  [
    "Nelerin eksik olduğunu birlikte çıkaralım.",
    "Tayfa hazır olmadan yola çıkmak istemiyorum."
  ],
  [
    "İlk haberi kim verdiğini anlat; izini oradan sürelim.",
    "Buna hemen inanmayalım; önce başka bir kaynaktan dinleyelim."
  ],
  [
    "Borcu nasıl kapatabileceğimizi konuşalım; seni de zor durumda bırakmak istemem.",
    "Yeni bir işe girmeden önce şartları açıkça görelim."
  ],
  [
    "Benden ne öğrenmek istediklerini anlat; gerisini ben düşünürüm.",
    "Bunu sana anlatamam; kimlerle görüştüğümü korumam gerekiyor."
  ],
  [
    "Yeni habercinin kim olduğunu anlat; yüzünü bilmek isterim.",
    "Güvenmeden önce geçmişini biraz araştıralım."
  ],
  [
    "Gecikmenin sebebini bulalım; belki yük hâlâ kurtarılabilir.",
    "Bu işe karışmadan önce ne kadar risk aldığımızı bilmek istiyorum."
  ],
  [
    "Evdekilerin neden beklediğini anlat; onları daha fazla merakta bırakmayalım.",
    "Daha ne kadar kalacağımı bilmiyorum ama onlara bir haber göndereceğim."
  ],
  [
    "Neden geri çekilmem gerektiğini anlat; dostça uyarıyorsan dinlerim.",
    "Beni kim izliyorsa önce onu anlamak istiyorum."
  ],
  [
    "Ne kadar erzak gerektiğini birlikte hesaplayalım.",
    "Bu kadar erzağın neden gerektiğini bilmeden masrafa girmeyelim."
  ]
];

const places = [
  ['Galata', 'Galata’daki hareketlilik'],
  ['İstanbul', 'Payitahttan gelen haberler'],
  ['Venedik', 'Venedik bağlantılarından gelen bilgi'],
  ['Ragusa', 'Ragusa üzerinden gelen haber'],
  ['Cezayir', 'Cezayir limanındaki gelişmeler'],
  ['Tunus', 'Tunus’taki tüccar çevresi'],
  ['Trablusgarp', 'Trablusgarp’taki denizciler'],
  ['Cerbe', 'Cerbe’deki gemi hareketliliği'],
  ['Malta', 'Malta üzerinden gelen haber'],
  ['Sicilya', 'Sicilya kıyılarından gelen bilgiler'],
];

const dates = [
  ['1550-01-01', '1560-12-31'],
  ['1561-01-01', '1570-12-31'],
  ['1571-01-01', '1580-12-31'],
  ['1581-01-01', '1590-12-31'],
  ['1591-01-01', '1600-12-31'],
];

export const EXPANDED_MEDITERRANEAN_CARDS: MediterraneanCardDefinition[] = scenes.flatMap(
  ([subject, setup, primary, secondary], sceneIndex) =>
    places.map(([place, context], placeIndex) => {
      const date = dates[(sceneIndex + placeIndex) % dates.length];
      const id = `med-arc-${sceneIndex + 1}-${placeIndex + 1}`;
      const leftDelta = 2 + ((sceneIndex + placeIndex) % 3);
      const rightDelta = 3 + ((sceneIndex * 2 + placeIndex) % 4);
      const leftEffects = [
        change(primary, leftDelta),
        change('safety', 1),
        days(45 + ((sceneIndex + placeIndex) % 5) * 20),
      ];
      const rightEffects = [
        change(secondary, rightDelta),
        change('safety', -1 - ((sceneIndex + placeIndex) % 2)),
        days(55 + ((sceneIndex * 2 + placeIndex) % 5) * 20),
        flag(`seen_${sceneIndex + 1}_${placeIndex + 1}`),
      ];
      return {
        id,
        speaker: place,
        role: 'Aracı / tanık',
        line: dialogues[sceneIndex],
        category: ([
          'INTELLIGENCE',
          'TRADE',
          'TRADE',
          'SEA',
          'INTELLIGENCE',
          'PORT',
          'PORT',
          'CAPTIVITY',
          'IDENTITY',
          'SEA',
          'INTELLIGENCE',
          'TRADE',
          'INTELLIGENCE',
          'INTELLIGENCE',
          'TRADE',
          'FAMILY',
          'PORT',
          'SEA',
        ] as const)[sceneIndex],
        minDate: date[0],
        maxDate: date[1],
        weight: 4 + ((sceneIndex + placeIndex) % 7),
        left: makeChoice(
          'hold-back',
          replyForScene(sceneIndex,0),
          'Sakin konuşup önce bilgiyi sınayacağım.',
          leftEffects,
        ),
        right: makeChoice(
          'step-in',
          replyForScene(sceneIndex,1),
          'Konuşmayı sürdüreceğim ama söylediklerini doğrulayacağım.',
          rightEffects,
        ),
      };
    }),
);

export const EXPANDED_CARD_COUNT = EXPANDED_MEDITERRANEAN_CARDS.length;
