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
  {id:'agent',speaker:'Bir aracı',role:'Haber taşıyıcısı',line:'Bu haberi kimden duydun?',category:'INTELLIGENCE',a:'information',b:'intelligenceNetwork',flag:'agent_network'},
  {id:'merchant',speaker:'Bir tüccar',role:'Tüccar',line:'Bu fiyat değişikliği sana da garip gelmiyor mu?',category:'TRADE',a:'money',b:'merchantNetwork',flag:'merchant_route'},
  {id:'venetian',speaker:'Venedikli tüccar',role:'Yabancı tüccar',line:'Venedik\'ten geldim. Burada neler oluyor?',category:'TRADE',a:'merchantNetwork',b:'information',flag:'venetian_contact'},
  {id:'interpreter',speaker:'Bir tercüman',role:'Tercüman',line:'Bu sözü doğru çevirdiğinden emin misin?',category:'IDENTITY',a:'language',b:'information',flag:'interpreter_contact'},
  {id:'clerk',speaker:'Kayıt memuru',role:'Liman kâtibi',line:'Şu kayda bir bak. Sence burada ne eksik?',category:'PORT',a:'information',b:'reputation',flag:'clerk_contact'},
  {id:'sailor',speaker:'Bir denizci',role:'Denizci',line:'Bu gemi nereye gidiyor, biliyor musun?',category:'SEA',a:'sailorNetwork',b:'information',flag:'sailor_contact'},
  {id:'captive',speaker:'Esaretten dönen biri',role:'Dönmüş denizci',line:'Uzun zaman sonra döndüm. Evde beni bekleyenler var.',category:'CAPTIVITY',a:'social',b:'familyTies',flag:'captivity_memory'},
  {id:'convert',speaker:'Mühtedi bir denizci',role:'Aracı',line:'İki tarafı da tanıyorum. İstersen seni tanıştırırım.',category:'IDENTITY',a:'language',b:'social',flag:'cross_culture'},
  {id:'family',speaker:'Meryem',role:'Aileden biri',line:'Evdekiler seni soruyor. Ne zaman döneceksin?',category:'FAMILY',a:'familyTies',b:'safety',flag:'family_anchor'},
  {id:'official',speaker:'Bir görevli',role:'Liman görevlisi',line:'Çok görünür oldun. Biraz dikkatli ol.',category:'PORT',a:'reputation',b:'safety',flag:'official_watch'},
  {id:'rumor',speaker:'Kahvedeki tanıdık',role:'Söylenti taşıyıcısı',line:'Bu söylentiyi sen de duydun mu?',category:'INTELLIGENCE',a:'social',b:'information',flag:'rumor_chain'},
  {id:'debt',speaker:'Alacaklı tüccar',role:'Tüccar',line:'Eski borcunu unutmadım. Ne yapacaksın?',category:'TRADE',a:'money',b:'merchantNetwork',flag:'debt_chain'},
  {id:'shipmaster',speaker:'Gemi sorumlusu',role:'Gemi yöneticisi',line:'Sefer için her şey hazır mı?',category:'SEA',a:'safety',b:'sailorNetwork',flag:'ship_trust'},
  {id:'messenger',speaker:'Bir haberci',role:'Haberci',line:'Bu haberi kime götürmemi istiyorsun?',category:'INTELLIGENCE',a:'intelligenceNetwork',b:'reputation',flag:'messenger_route'},
  {id:'portmaster',speaker:'Liman yöneticisi',role:'Yetkili',line:'Limanda işler karışıyor. Sen ne biliyorsun?',category:'PORT',a:'safety',b:'merchantNetwork',flag:'port_authority'},
  {id:'broker',speaker:'Bir komisyoncu',role:'Aracı',line:'İki kişiyi tanıştırabilirim. İster misin?',category:'TRADE',a:'merchantNetwork',b:'reputation',flag:'broker_network'},
  {id:'mapmaker',speaker:'Haritacı',role:'Harita ustası',line:'Şu haritaya bak. Hangi limana gidelim?',category:'SEA',a:'information',b:'sailorNetwork',flag:'map_network'},
  {id:'translator',speaker:'Bir yazıcı',role:'Yazıcı',line:'Bu mektup sana nasıl ulaştı, biliyor musun?',category:'INTELLIGENCE',a:'language',b:'intelligenceNetwork',flag:'letter_chain'},
  {id:'household',speaker:'Ev halkından biri',role:'Aile çevresi',line:'Evdekiler seni bekliyor.',category:'FAMILY',a:'familyTies',b:'social',flag:'household_pressure'},
  {id:'veteran',speaker:'Yaşlı denizci',role:'Tecrübeli denizci',line:'Eski dostların hâlâ seni hatırlıyor.',category:'SEA',a:'sailorNetwork',b:'reputation',flag:'old_network'},
  {id:'guard',speaker:'Kapı görevlisi',role:'Görevli',line:'Kapıdan girenleri tanıyor musun?',category:'INTELLIGENCE',a:'safety',b:'information',flag:'gate_watch'},
  {id:'financier',speaker:'Sermayedar',role:'Finansör',line:'Para var ama güven de lazım.',category:'TRADE',a:'money',b:'reputation',flag:'capital_route'},
  {id:'doctor',speaker:'Hekim',role:'Seyahat eden hekim',line:'Yol uzun. Hazırlıklı mısın?',category:'SEA',a:'safety',b:'social',flag:'care_network'},
  {id:'dockworker',speaker:'Bir hamal',role:'Liman işçisi',line:'Limanda çok şey görüyorum. İstersen anlatırım.',category:'PORT',a:'portReputation',b:'information',flag:'dock_network'},
  {id:'broker_woman',speaker:'Bir aracı kadın',role:'Haber aracısı',line:'Bu haberi sessizce ulaştırabilirim.',category:'INTELLIGENCE',a:'intelligenceNetwork',b:'social',flag:'quiet_network'},
];


const decisionPairs: Array<[string, string]> = [
  ['Kaynağını söylerim', 'Kimden geldiğini saklarım'],
  ['Fiyatı araştırırım', 'Fırsatı değerlendiririm'],
  ['Ne olduğunu sorarım', 'Önce onu dinlerim'],
  ['Sözü tekrarlarım', 'Önce doğrularım'],
  ['Kayda bakarım', 'Karışmam'],
  ['Güzergâhı sorarım', 'Güvenip geçerim'],
  ['Evime dönerim', 'Yola devam ederim'],
  ['Tanıştırmasını isterim', 'Mesafemi korurum'],
  ['Eve dönerim', 'Biraz daha kalırım'],
  ['Daha dikkatli olurum', 'İşime devam ederim'],
  ['Söylentiyi araştırırım', 'Kulak asmam'],
  ['Borcu öderim', 'Yeni iş isterim'],
  ['Eksikleri tamamlarım', 'Seferi ertelerim'],
  ['Haberi götürürüm', 'Önce kime gittiğini sorarım'],
  ['Ne bildiğimi anlatırım', 'Bildiklerimi saklarım'],
  ['Tanıştırmasını isterim', 'Tek başıma ilerlerim'],
  ['Yakın limanı seçerim', 'Uzak limana giderim'],
  ['Mektubu incelerim', 'Mektubu geri veririm'],
  ['Eve dönerim', 'Beklemelerini isterim'],
  ['Eski dostları ararım', 'Yeni çevre kurarım'],
  ['Gelenleri sorarım', 'Kapıyı kapalı tutarım'],
  ['Güveni önceleyip beklerim', 'Parayı önceleyip ilerlerim'],
  ['Hazırlanırım', 'Yolculuğu ertelerim'],
  ['Anlatmasını isterim', 'Kendi gözlerime güvenirim'],
];

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

export const REIGNS_SCALE_CARDS: MediterraneanCardDefinition[] = scenes.flatMap((scene, si) =>
  places.map(([place], pi) => {
    const period = periods[(si + pi) % periods.length];
    const positive = 2 + ((si * 3 + pi) % 4);
    const risk = 1 + ((si + pi) % 3);
    return {
      id: `med-reigns-${scene.id}-${pi + 1}`,
      speaker: scene.speaker,
      role: scene.role,
      line: scene.line,
      category: scene.category,
      minDate: period[0],
      maxDate: period[1],
      weight: 3 + ((si + pi) % 8),
      left: choice(
        'cautious',
        ['Beklerim','Mesafemi korurum','Önce araştırırım','Karışmam'][si % 4],
        'Bu soruya temkinli bir cevap ver; güvenliği ve mevcut bağları koru.',
        [change(scene.a, positive), change('safety', 1), days(35 + ((si + pi) % 5) * 15)],
      ),
      right: choice(
        'engage',
        ['İşe girerim','Bağlantıyı kullanırım','Haberin peşine düşerim','Aracılık ederim'][pi % 4],
        'Soruyu doğrudan karşıla; bağlantıyı güçlendirirken daha fazla risk üstlen.',
        [change(scene.b, positive + 1), change('safety', -risk), change('reputation', (si % 3) - 1), flag(`${scene.flag}_${pi + 1}`), days(45 + ((si * 2 + pi) % 6) * 15)],
      ),
    };
  }),
);

export const REIGNS_SCALE_CARD_COUNT = REIGNS_SCALE_CARDS.length;
