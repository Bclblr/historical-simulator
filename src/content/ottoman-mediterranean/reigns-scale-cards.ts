import type { MediterraneanCardDefinition, MediterraneanChoice } from './deck';

type Scene = {
  id: string;
  speaker: string;
  role: string;
  line: string;
  category: MediterraneanCardDefinition['category'];
  a: string;
  b: string;
  flag: string;
};

const change = (key: string, delta: number) => ({ type: 'CHANGE_VARIABLE', key, delta } as const);
const flag = (key: string) => ({ type: 'SET_FLAG', key, value: true } as const);
const days = (n: number) => ({ type: 'ADVANCE_DAYS', days: n } as const);

const choice = (idSuffix: string, label: string, description: string, effects: any[]): MediterraneanChoice => ({
  idSuffix, label, description, effects,
});

const scenes: Scene[] = [
  {id:'agent',speaker:'Bir aracı',role:'Haber taşıyıcısı',line:'Bu haberi limandaki bir aracıdan aldım; adam kaynağını gizlemek istiyor.',category:'INTELLIGENCE',a:'information',b:'intelligenceNetwork',flag:'agent_network'},
  {id:'merchant',speaker:'Bir tüccar',role:'Tüccar',line:'Bu fiyatın bir gecede değişmesi boşuna değil; limanda bunun arkasında bir hareket olduğunu konuşuyorlar.',category:'TRADE',a:'money',b:'merchantNetwork',flag:'merchant_route'},
  {id:'venetian',speaker:'Venedikli tüccar',role:'Yabancı tüccar',line:'Venedik\\'ten geldim; burada dönen ticaret ve haber trafiğini yakından gördüm.',category:'TRADE',a:'merchantNetwork',b:'information',flag:'venetian_contact'},
  {id:'interpreter',speaker:'Bir tercüman',role:'Tercüman',line:'Bu sözün başka bir anlamı da var; tercüme ederken asıl niyeti kaçırmamamız gerekiyor.',category:'IDENTITY',a:'language',b:'information',flag:'interpreter_contact'},
  {id:'clerk',speaker:'Kayıt memuru',role:'Liman kâtibi',line:'Şu kayıtta bir boşluk var; birinin bazı satırları özellikle değiştirdiğini fark ettim.',category:'PORT',a:'information',b:'reputation',flag:'clerk_contact'},
  {id:'sailor',speaker:'Bir denizci',role:'Denizci',line:'Bu gemi kuzeye değil, başka bir hatta dönüyor; denizde bunu konuşan birkaç kişi daha var.',category:'SEA',a:'sailorNetwork',b:'information',flag:'sailor_contact'},
  {id:'captive',speaker:'Esaretten dönen biri',role:'Dönmüş denizci',line:'Uzun zaman sonra döndüm; evde beni bekleyenler var ama burada öğrendiklerimi de unutamıyorum.',category:'CAPTIVITY',a:'social',b:'familyTies',flag:'captivity_memory'},
  {id:'convert',speaker:'Mühtedi bir denizci',role:'Aracı',line:'İki tarafı da tanıyorum; istersen seni birbirine değmeden konuşabilecek insanlarla tanıştırırım.',category:'IDENTITY',a:'language',b:'social',flag:'cross_culture'},
  {id:'family',speaker:'Meryem',role:'Aileden biri',line:'Evdekiler seni özledi; Meryem özellikle senden haber bekliyor.',category:'FAMILY',a:'familyTies',b:'safety',flag:'family_anchor'},
  {id:'official',speaker:'Bir görevli',role:'Liman görevlisi',line:'Son günlerde adın limanda fazla duyuluyor; bunu dostça bir uyarı olarak kabul et.',category:'PORT',a:'reputation',b:'safety',flag:'official_watch'},
  {id:'rumor',speaker:'Kahvedeki tanıdık',role:'Söylenti taşıyıcısı',line:'Kahvede aynı olay üç ayrı biçimde anlatılıyor; belli ki biri gerçeği bilerek dağıtıyor.',category:'INTELLIGENCE',a:'social',b:'information',flag:'rumor_chain'},
  {id:'debt',speaker:'Alacaklı tüccar',role:'Tüccar',line:'Eski borcun hâlâ duruyor; seni sıkıştırmak istemem ama artık bir yol bulmamız gerekiyor.',category:'TRADE',a:'money',b:'merchantNetwork',flag:'debt_chain'},
  {id:'shipmaster',speaker:'Gemi sorumlusu',role:'Gemi yöneticisi',line:'Sefer için çoğu şey hazır; yalnız erzak ve tayfanın durumu konusunda hâlâ açık var.',category:'SEA',a:'safety',b:'sailorNetwork',flag:'ship_trust'},
  {id:'messenger',speaker:'Bir haberci',role:'Haberci',line:'Bu haberin gideceği kişi belli; mesele, onu hangi yoldan güvenle ulaştıracağımız.',category:'INTELLIGENCE',a:'intelligenceNetwork',b:'reputation',flag:'messenger_route'},
  {id:'portmaster',speaker:'Liman yöneticisi',role:'Yetkili',line:'Limanda işler karışıyor; birkaç tüccar aynı yükün peşine düşmüş durumda.',category:'PORT',a:'safety',b:'merchantNetwork',flag:'port_authority'},
  {id:'broker',speaker:'Bir komisyoncu',role:'Aracı',line:'İki çevreyi de tanıyorum; aralarında bir bağlantı kurarsam işin kolaylaşabilir.',category:'TRADE',a:'merchantNetwork',b:'reputation',flag:'broker_network'},
  {id:'mapmaker',speaker:'Haritacı',role:'Harita ustası',line:'Haritaya baktım; bazı yollar güvenli görünse de haber akışı açısından hiç de öyle değil.',category:'SEA',a:'information',b:'sailorNetwork',flag:'map_network'},
  {id:'translator',speaker:'Bir yazıcı',role:'Yazıcı',line:'Bu mektup elime beklenmedik bir yoldan geçti; kimin yazdığını anlamak mümkün.',category:'INTELLIGENCE',a:'language',b:'intelligenceNetwork',flag:'letter_chain'},
  {id:'household',speaker:'Ev halkından biri',role:'Aile çevresi',line:'Evdekiler senden uzun zamandır haber bekliyor; sessiz kaldıkça merakları artıyor.',category:'FAMILY',a:'familyTies',b:'social',flag:'household_pressure'},
  {id:'veteran',speaker:'Yaşlı denizci',role:'Tecrübeli denizci',line:'Eski dostların hâlâ seni hatırlıyor; bazıları yeniden görüşmek için haber göndermiş.',category:'SEA',a:'sailorNetwork',b:'reputation',flag:'old_network'},
  {id:'guard',speaker:'Kapı görevlisi',role:'Görevli',line:'Kapıdan bugün tanımadığımız birkaç kişi geçti; içeridekiler bundan pek hoşnut değil.',category:'INTELLIGENCE',a:'safety',b:'information',flag:'gate_watch'},
  {id:'financier',speaker:'Sermayedar',role:'Finansör',line:'Para bulunur; asıl mesele, bu işe kimin adını ve itibarını koyacağı.',category:'TRADE',a:'money',b:'reputation',flag:'capital_route'},
  {id:'doctor',speaker:'Hekim',role:'Seyahat eden hekim',line:'Yol uzun olacak; hastalık ve yorgunluk ihtimalini hesaba katmadan çıkmak doğru olmaz.',category:'SEA',a:'safety',b:'social',flag:'care_network'},
  {id:'dockworker',speaker:'Bir hamal',role:'Liman işçisi',line:'Ben limanda gün boyu yük ve insan görüyorum; bugün alışılmadık bir hareketlilik var.',category:'PORT',a:'portReputation',b:'information',flag:'dock_network'},
  {id:'broker_woman',speaker:'Bir aracı kadın',role:'Haber aracısı',line:'Bu haberi sessizce ulaştırabilirim; ama kimsenin adını gereksiz yere ortaya çıkarmayalım.',category:'INTELLIGENCE',a:'intelligenceNetwork',b:'social',flag:'quiet_network'},
];


const decisionPairsByScene: Record<string, [string, string]> = {
  "agent": [
    "Kaynağın adını bana söyle.",
    "Kaynağını açıklamıyorsan bu habere hemen güvenemem."
  ],
  "merchant": [
    "Fiyatın arkasındaki hesabı anlat.",
    "Önce kimin kazandığını anlamak istiyorum."
  ],
  "venetian": [
    "Venedik tarafında gördüklerini anlat.",
    "Bu bağlantıya girmeden önce niyetini bilmek istiyorum."
  ],
  "interpreter": [
    "Sözün asıl anlamını bana aktar.",
    "Çeviriyi başka bir tercümanla da karşılaştıracağım."
  ],
  "clerk": [
    "Kayıttaki boşluğu bana göster.",
    "Bunun neden değiştirildiğini anlamadan ilerlemem."
  ],
  "sailor": [
    "Bu geminin rotasını bana anlat.",
    "Haberi başka bir denizciden de doğrulayacağım."
  ],
  "captive": [
    "Döndüğünde neler gördüğünü anlat.",
    "Geçmişini anlatmak istemiyorsan seni zorlamam."
  ],
  "convert": [
    "Beni tanıştıracağın insanları anlat.",
    "Önce onların sana neden güvendiğini bilmek istiyorum."
  ],
  "family": [
    "Evdekilerin senden beklediğini bana anlat.",
    "Onlara haber göndermeden önce durumlarını öğrenelim."
  ],
  "official": [
    "Beni kimin izlediğini anlat.",
    "Sözünü ciddiye alacağım ama hemen ortadan kaybolmayacağım."
  ],
  "rumor": [
    "Bu söylentinin nasıl yayıldığını anlat.",
    "Ben başka bir kaynaktan doğrulamadan buna kapılmayacağım."
  ],
  "debt": [
    "Eski borcu nasıl kapatabileceğimizi konuşalım.",
    "Beni sıkıştırmadan önce sana açık bir hesap çıkaracağım."
  ],
  "shipmaster": [
    "Eksikleri tek tek anlatalım.",
    "Tayfanın durumunu görmeden yola çıkmayacağım."
  ],
  "messenger": [
    "Haberin kime gideceğini söyle.",
    "Kimlerin elinden geçeceğini bilmeden taşıyamam."
  ],
  "portmaster": [
    "Limandaki hareketliliği bana anlat.",
    "Benden ne istediğini açıkça söylemeden konuşmayacağım."
  ],
  "broker": [
    "Beni kimlerle tanıştırabileceğini anlat.",
    "Bu bağlantıya girmeden önce senin payını bilmek istiyorum."
  ],
  "mapmaker": [
    "Haritadaki güvenli yolu bana göster.",
    "Rotayı seçmeden önce haber akışını da hesaba katacağım."
  ],
  "translator": [
    "Mektubun nasıl eline geçtiğini anlat.",
    "Yazıyı başka bir gözün de kontrol etmesini isterim."
  ],
  "household": [
    "Evdekilerin neden bu kadar beklediğini anlat.",
    "Onları merakta bırakmak istemiyorum; bir haber göndereceğim."
  ],
  "veteran": [
    "Eski dostların kim olduğunu anlat.",
    "Yeniden güvenmeden önce ne değiştiğini bilmek istiyorum."
  ],
  "guard": [
    "Kapıdan geçenleri bana anlat.",
    "Tanımadığımız kişileri hemen suçlamayalım; önce izlerini görelim."
  ],
  "financier": [
    "Bu işin hesabını açıkça anlat.",
    "İtibarımı ortaya koymadan önce şartları görmek istiyorum."
  ],
  "doctor": [
    "Yolun bizi ne kadar zorlayacağını anlat.",
    "Tayfanın durumunu görmeden karar vermeyeceğim."
  ],
  "dockworker": [
    "Bugün limanda ne gördüğünü anlat.",
    "Bu bilgiyi kiminle paylaşacağımı dikkatle seçeceğim."
  ],
  "broker_woman": [
    "Haberi hangi yoldan ulaştıracağını anlat.",
    "Kimsenin adını gereksiz yere ortaya çıkarmayalım."
  ]
};


const places = [
  ['Galata','Galata'],['İstanbul','payitaht'],['Venedik','Venedik'],['Ragusa','Ragusa'],
  ['Cezayir','Cezayir'],['Tunus','Tunus'],['Trablusgarp','Trablusgarp'],['Cerbe','Cerbe'],
  ['Malta','Malta'],['Sicilya','Sicilya'],['Messina','Messina'],['Napoli','Napoli'],
  ['Korfu','Korfu'],['Girit','Girit'],['Kıbrıs','Kıbrıs'],['Rodos','Rodos'],
  ['İskenderiye','İskenderiye'],['İzmir','İzmir'],['Ancona','Ancona'],['Livorno','Livorno'],
  ['Marsilya','Marsilya'],['Barselona','Barselona'],['Valensiya','Valensiya'],['Palermo','Palermo'],
  ['Dubrovnik','Dubrovnik'],
];

const periods = [
  ['1550-01-01','1559-12-31'],['1560-01-01','1569-12-31'],['1570-01-01','1579-12-31'],
  ['1580-01-01','1589-12-31'],['1590-01-01','1599-12-31'],
];

const placeLines: Record<string, [string, string]> = {
  Galata: ['Galata’da bu haber hızla yayılıyor.', 'Galata’daki tüccarlar aynı gelişmeyi kendi aralarında tartışıyor.'],
  İstanbul: ['İstanbul’da bunun konuşulduğunu duydum.', 'Payitahttaki çevreler bu haberin peşine düşmüş.'],
  Venedik: ['Venedik’ten gelen haberler birbirini tutmuyor.', 'Venedikli tüccarlar farklı hesaplar yapıyor.'],
  Ragusa: ['Ragusa’dan gelen aracılar farklı şeyler anlatıyor.', 'Ragusa bağlantıları yeni haberler taşıyor.'],
  Cezayir: ['Cezayir tarafında denizciler bunu konuşuyor.', 'Mağrib’den gelen gemiciler aynı gelişmeden söz ediyor.'],
  Tunus: ['Tunus bağlantıları yeniden hareketlenmiş.', 'Tunus’taki aracılar limandaki değişimi birbirine aktarıyor.'],
  Trablusgarp: ['Trablusgarp’tan gelen haber gecikmiş.', 'Trablusgarp hattındaki insanlar gecikmenin nedenini konuşuyor.'],
  Cerbe: ['Cerbe çevresinden gelen haber hâlâ konuşuluyor.', 'Cerbe’den dönen denizciler farklı ayrıntılar anlatıyor.'],
  Malta: ['Malta çevresindeki haberler limanı meşgul ediyor.', 'Malta hattından gelen gemiler yeni söylentiler taşıyor.'],
  Sicilya: ['Sicilya’dan gelen gemiler farklı haberler getiriyor.', 'Sicilya hattındaki tüccarlar gelişmeleri birbirine anlatıyor.'],
  Messina: ['Messina’dan gelen tüccar beklenmedik bir şey anlattı.', 'Messina’dan gelen haber limandaki hesapları değiştirmiş.'],
  Napoli: ['Napoli tarafındaki tüccarlar yeni bir hesap yapıyor.', 'Napoli bağlantıları ticaretin yön değiştirdiğini söylüyor.'],
  Korfu: ['Korfu üzerinden geçenler farklı söylentiler taşıyor.', 'Korfu’dan geçen denizciler aynı olayın başka yüzünü anlatıyor.'],
  Girit: ['Girit’teki denizciler yolu iyi biliyor.', 'Girit üzerinden gelenler rotadaki değişiklikleri anlatıyor.'],
  Kıbrıs: ['Kıbrıs hakkında yeni haberler dolaşıyor.', 'Kıbrıs hattındaki hareketlilik limanlarda konuşuluyor.'],
  Rodos: ['Rodos’tan gelen haber limanda yankılandı.', 'Rodos bağlantıları yeni bir hareketliliğin izini taşıyor.'],
  İskenderiye: ['İskenderiye’den gelen tüccarlar yeni haberler taşıyor.', 'İskenderiye hattında ticaretle haber birbirine karışmış durumda.'],
  İzmir: ['İzmir limanında aynı konu konuşuluyor.', 'İzmir’den gelen tüccarlar farklı ayrıntılar getiriyor.'],
  Ancona: ['Ancona’dan gelen tüccar farklı bir fiyat söyledi.', 'Ancona hattındaki tüccarlar fiyatların neden değiştiğini tartışıyor.'],
  Livorno: ['Livorno bağlantısı yeni bir haber getirdi.', 'Livorno’dan gelen insanlar limandaki hareketliliği anlatıyor.'],
  Marsilya: ['Marsilya’dan gelen haber burada da duyulmuş.', 'Marsilya hattındaki tüccarlar başka bir gelişmeden söz ediyor.'],
  Barselona: ['Barselona hattından gelen haber gecikmiş.', 'Barselona bağlantısı haberin geç ulaştığını anlatıyor.'],
  Valensiya: ['Valensiya’dan gelen tüccar farklı bir rota anlatıyor.', 'Valensiya hattında rotaların yeniden değiştiği konuşuluyor.'],
  Palermo: ['Palermo’dan gelen denizciler başka bir şey söylüyor.', 'Palermo hattındaki gemiciler olayın farklı yüzünü anlatıyor.'],
  Dubrovnik: ['Dubrovnik’ten gelen aracı eski bağlantılardan söz ediyor.', 'Dubrovnik’teki bağlantılar geçmişten kalan haberleri yeniden taşıyor.'],
};

export const REIGNS_SCALE_CARDS: MediterraneanCardDefinition[] = scenes.flatMap((scene, si) =>
  places.map(([place], pi) => {
    const period = periods[(si + pi) % periods.length];
    const positive = 2 + ((si * 3 + pi) % 4);
    const risk = 1 + ((si + pi) % 3);
    const local = placeLines[place] ?? [`${place} çevresinden yeni bir haber geldi.`, `${place} çevresindeki insanlar gelişmeyi kendi aralarında konuşuyor.`];
    const question = decisionPairsByScene[scene.id];
    return {
      id: `med-reigns-${scene.id}-${pi + 1}`,
      speaker: scene.speaker,
      role: scene.role,
      line: `${scene.line} ${local[pi % 2]} ${question[0]}`,
      category: scene.category,
      minDate: period[0],
      maxDate: period[1],
      weight: 3 + ((si + pi) % 8),
      left: choice(
        'cautious',
        question[0],
        'Söyleneni dikkatle dinleyip karar vereceğim.',
        [change(scene.a, positive), change('safety', 1), days(35 + ((si + pi) % 5) * 15)],
      ),
      right: choice(
        'engage',
        question[1],
        'Konuşmayı sürdüreceğim; ama söylediklerini doğrulayacağım.',
        [change(scene.b, positive + 1), change('safety', -risk), change('reputation', (si % 3) - 1), flag(`${scene.flag}_${pi + 1}`), days(45 + ((si * 2 + pi) % 6) * 15)],
      ),
    };
  }),
);

export const REIGNS_SCALE_CARD_COUNT = REIGNS_SCALE_CARDS.length;
