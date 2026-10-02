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
        line: 'Bir mektup getirdim. İçinde ne olduğunu bilmiyorum.',
        category: (['INTELLIGENCE', 'TRADE', 'PORT', 'SEA', 'IDENTITY', 'FAMILY'] as const)[
          (sceneIndex + placeIndex) % 6
        ],
        minDate: date[0],
        maxDate: date[1],
        weight: 4 + ((sceneIndex + placeIndex) % 7),
        left: makeChoice(
          'hold-back',
          'Mesafemi korurum',
          'Bilgiyi ve bağlantıyı sınırlı tut; daha düşük riskle ilerle.',
          leftEffects,
        ),
        right: makeChoice(
          'step-in',
          'İşin içine girerim',
          'Ağın içine daha fazla gir; daha değerli bağlantılar kazan ama görünürlüğün artsın.',
          rightEffects,
        ),
      };
    }),
);

export const EXPANDED_CARD_COUNT = EXPANDED_MEDITERRANEAN_CARDS.length;
