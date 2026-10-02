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
  {id:'agent',speaker:'Bir aracı',role:'Haber taşıyıcısı',line:'Kaynağını bilmediğin bir habere güvenme. Bana önce bu bilginin kimden geldiğini söyle.',category:'INTELLIGENCE',a:'information',b:'intelligenceNetwork',flag:'agent_network'},
  {id:'merchant',speaker:'Bir tüccar',role:'Tüccar',line:'Fiyatlar durup dururken değişmez. Bu limanda bir şey dönüyor; sen de bunu fark ettin, değil mi?',category:'TRADE',a:'money',b:'merchantNetwork',flag:'merchant_route'},
  {id:'venetian',speaker:'Venedikli tüccar',role:'Yabancı tüccar',line:'Ben Venedik\'ten geldim. Limanda kimin konuştuğunu bilmek, neyin satıldığını bilmek kadar önemli. Bana ne duyduğunu anlat.',category:'TRADE',a:'merchantNetwork',b:'information',flag:'venetian_contact'},
  {id:'interpreter',speaker:'Bir tercüman',role:'Tercüman',line:'Aynı cümleyi farklı dillerde farklı anlayabiliriz. Sözü yanlış aktarmak istemiyorsan beni dinle.',category:'IDENTITY',a:'language',b:'information',flag:'interpreter_contact'},
  {id:'clerk',speaker:'Kayıt memuru',role:'Liman kâtibi',line:'Şu kayıtlardaki küçük ayrıntıya bak. Burada büyük bir haber saklı olabilir.',category:'PORT',a:'information',b:'reputation',flag:'clerk_contact'},
  {id:'sailor',speaker:'Bir denizci',role:'Denizci',line:'Bir geminin nereye gittiğini herkes farklı anlatıyor. Sen hangi habere güveneceğine nasıl karar veriyorsun?',category:'SEA',a:'sailorNetwork',b:'information',flag:'sailor_contact'},
  {id:'captive',speaker:'Esaretten dönen biri',role:'Dönmüş denizci',line:'Esaretten döndüm ama geride bıraktığım hayat hâlâ peşimi bırakmadı. Ailemin ve eski bağlantılarımın hesabını yeniden kurmam gerekiyor.',category:'CAPTIVITY',a:'social',b:'familyTies',flag:'captivity_memory'},
  {id:'convert',speaker:'Mühtedi bir denizci',role:'Aracı',line:'Eski çevremi de yeni çevremi de tanıyorum. İstersen iki taraf arasında sana aracılık edebilirim.',category:'IDENTITY',a:'language',b:'social',flag:'cross_culture'},
  {id:'family',speaker:'Meryem',role:'Aileden biri',line:'Bu kadar zaman limanda kalabilirsin ama evde seni bekleyen insanlar da var. Onları tamamen unutma.',category:'FAMILY',a:'familyTies',b:'safety',flag:'family_anchor'},
  {id:'official',speaker:'Bir görevli',role:'Liman görevlisi',line:'Fazla görünür olursan insanlar seni konuşmaya başlar. Bazen güven kazanırsın, bazen şüphe çekersin.',category:'PORT',a:'reputation',b:'safety',flag:'official_watch'},
  {id:'rumor',speaker:'Kahvedeki tanıdık',role:'Söylenti taşıyıcısı',line:'Aynı haberi üç kişiden dinledim ve üç farklı hikâye duydum. Sen olsan hangisini araştırırsın?',category:'INTELLIGENCE',a:'social',b:'information',flag:'rumor_chain'},
  {id:'debt',speaker:'Alacaklı tüccar',role:'Tüccar',line:'Eski borcun kapanmadı. Ama istersen bu borcu yeni bir işin başlangıcına çevirebiliriz.',category:'TRADE',a:'money',b:'merchantNetwork',flag:'debt_chain'},
  {id:'shipmaster',speaker:'Gemi sorumlusu',role:'Gemi yöneticisi',line:'Bu yolculukta para kadar erzak ve tayfanın güveni de önemli. Bunlardan birini ihmal edersen hepimiz zarar görürüz.',category:'SEA',a:'safety',b:'sailorNetwork',flag:'ship_trust'},
  {id:'messenger',speaker:'Bir haberci',role:'Haberci',line:'Haberi taşımak kolaydır. Asıl mesele, bu haberi kime götürdüğünü bilmektir. Sen kime güveniyorsun?',category:'INTELLIGENCE',a:'intelligenceNetwork',b:'reputation',flag:'messenger_route'},
  {id:'portmaster',speaker:'Liman yöneticisi',role:'Yetkili',line:'Limandaki düzen bozulursa ticaret de haber akışı da bozulur. Bu yüzden senden açıkça ne bildiğini söylemeni istiyorum.',category:'PORT',a:'safety',b:'merchantNetwork',flag:'port_authority'},
  {id:'broker',speaker:'Bir komisyoncu',role:'Aracı',line:'İnsanları birbirine bağlamak para kazandırır. Fakat yanlış iki kişiyi bir araya getirirsen bedelini sen ödersin.',category:'TRADE',a:'merchantNetwork',b:'reputation',flag:'broker_network'},
  {id:'mapmaker',speaker:'Haritacı',role:'Harita ustası',line:'Denizi bilmek yetmez. Limanların birbirine nasıl bağlandığını da bilmek gerekir. Haritayı birlikte inceleyelim.',category:'SEA',a:'information',b:'sailorNetwork',flag:'map_network'},
  {id:'translator',speaker:'Bir yazıcı',role:'Yazıcı',line:'Bir mektubun kelimeleri kadar kimlerin elinden geçtiği de önemlidir. Bu mektubu sana ulaştıran zinciri biliyor musun?',category:'INTELLIGENCE',a:'language',b:'intelligenceNetwork',flag:'letter_chain'},
  {id:'household',speaker:'Ev halkından biri',role:'Aile çevresi',line:'Uzun seferlerin bedeli yalnızca denizde ödenmez. Evde seni bekleyenlerin de bir sözü var.',category:'FAMILY',a:'familyTies',b:'social',flag:'household_pressure'},
  {id:'veteran',speaker:'Yaşlı denizci',role:'Tecrübeli denizci',line:'Gençken kurduğun bağlantılar yıllar sonra karşına çıkar. Eski tanıdıklarını hafife alma.',category:'SEA',a:'sailorNetwork',b:'reputation',flag:'old_network'},
  {id:'guard',speaker:'Kapı görevlisi',role:'Görevli',line:'Kapıdan kimin girdiğini bilmek bazen ne söylediğini bilmekten daha değerlidir. Buradaki insanları tanıyor musun?',category:'INTELLIGENCE',a:'safety',b:'information',flag:'gate_watch'},
  {id:'financier',speaker:'Sermayedar',role:'Finansör',line:'Bir ticaret yolunu büyütmek istiyorsan güven kadar sermaye de gerekir. Elindeki imkânı doğru kullan.',category:'TRADE',a:'money',b:'reputation',flag:'capital_route'},
  {id:'doctor',speaker:'Hekim',role:'Seyahat eden hekim',line:'Uzun yolculukta insanı ayakta tutan yalnızca para değildir. İnsanların birbirine güvenmesi de gerekir.',category:'SEA',a:'safety',b:'social',flag:'care_network'},
  {id:'dockworker',speaker:'Bir hamal',role:'Liman işçisi',line:'Bu limanın gündelik işlerini bilen kişi, gemilerin hareketini de görür. Gördüklerimi sana anlatabilirim.',category:'PORT',a:'portReputation',b:'information',flag:'dock_network'},
  {id:'broker_woman',speaker:'Bir aracı kadın',role:'Haber aracısı',line:'Her haber yüksek sesle söylenmez. Bazı sözler yalnızca doğru kişiye, doğru zamanda ulaştırılır.',category:'INTELLIGENCE',a:'intelligenceNetwork',b:'social',flag:'quiet_network'},
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
        'Daha temkinli ilerle; güvenliği ve mevcut bağları koru.',
        [change(scene.a, positive), change('safety', 1), days(35 + ((si + pi) % 5) * 15)],
      ),
      right: choice(
        'engage',
        ['İşe girerim','Bağlantıyı kullanırım','Haberin peşine düşerim','Aracılık ederim'][pi % 4],
        'Ağın içine daha fazla gir; daha değerli bağlantı karşılığında risk üstlen.',
        [change(scene.b, positive + 1), change('safety', -risk), change('reputation', (si % 3) - 1), flag(`${scene.flag}_${pi + 1}`), days(45 + ((si * 2 + pi) % 6) * 15)],
      ),
    };
  }),
);

export const REIGNS_SCALE_CARD_COUNT = REIGNS_SCALE_CARDS.length;
