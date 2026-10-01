import type { DecisionEffect, GameSessionSnapshot } from '@/domain/game';
import { createHistoricalEvent, type HistoricalEvent } from '@/domain/history';

export interface LifeChoice {
  idSuffix: string;
  label: string;
  description: string;
  effects: DecisionEffect[];
}

export interface LifeCardDefinition {
  id: string;
  speaker: string;
  role?: string;
  line: string;
  left: LifeChoice;
  right: LifeChoice;
  minDate?: string;
  maxDate?: string;
  requires?: Record<string, boolean>;
  weight?: number;
}

export interface ActiveLifeCard {
  event: HistoricalEvent;
  card: LifeCardDefinition;
}

const change = (key: string, delta: number): DecisionEffect => ({
  type: 'CHANGE_VARIABLE',
  key,
  delta,
});

const flag = (key: string, value = true): DecisionEffect => ({
  type: 'SET_FLAG',
  key,
  value,
});

const days = (value: number): DecisionEffect => ({
  type: 'ADVANCE_DAYS',
  days: value,
});

const choice = (
  idSuffix: string,
  label: string,
  description: string,
  effects: DecisionEffect[],
): LifeChoice => ({ idSuffix, label, description, effects });

const LIFE_CARDS: LifeCardDefinition[] = [
  {
    id: 'life-1933-new-job',
    speaker: 'Bay Weber',
    role: 'Atölye ustası',
    line: 'Atölyede düzenli bir yer açıldı. Ücret iyi sayılır ama günlerinin çoğu burada geçecek. İster misin?',
    maxDate: '1935-12-31',
    weight: 7,
    left: choice('stay-flexible', 'Şimdilik istemiyorum', 'Daha serbest ama belirsiz bir hayatı sürdür.', [
      change('money', -2),
      change('social', 2),
      flag('steady_job', false),
      days(75),
    ]),
    right: choice('take-steady-job', 'İşi kabul et', 'Düzenli gelir karşılığında daha bağlı bir çalışma düzenine gir.', [
      change('money', 4),
      change('safety', 2),
      change('social', -2),
      flag('steady_job'),
      days(90),
    ]),
  },
  {
    id: 'life-1933-roommate',
    speaker: 'Friedrich',
    role: 'Eski arkadaşın',
    line: 'Kiralar arttı. Aynı evi paylaşsak ikimizin de masrafı azalır. Ne dersin?',
    maxDate: '1937-12-31',
    weight: 5,
    left: choice('live-alone', 'Tek kalacağım', 'Masrafı üstlenip kendi alanını koru.', [
      change('money', -3),
      change('social', -1),
      flag('has_roommate', false),
      days(60),
    ]),
    right: choice('share-home', 'Birlikte yaşayalım', 'Masrafı paylaş ve Friedrich ile daha yakın bir hayat kur.', [
      change('money', 3),
      change('social', 3),
      change('reputation', 1),
      flag('has_roommate'),
      days(60),
    ]),
  },
  {
    id: 'life-1934-work-promotion',
    speaker: 'Bay Weber',
    role: 'Atölye ustası',
    line: 'Seni daha görünür bir göreve almak istiyorum. Ücret artacak ama herkes yaptığın işi izleyecek.',
    minDate: '1934-01-01',
    requires: { steady_job: true },
    weight: 8,
    left: choice('decline-promotion', 'Olduğum yerde kalayım', 'Daha az görünür ama daha rahat bir pozisyonu koru.', [
      change('safety', 2),
      change('reputation', -1),
      days(100),
    ]),
    right: choice('accept-promotion', 'Görevi alırım', 'Daha iyi gelir ve daha fazla görünürlük kazan.', [
      change('money', 4),
      change('reputation', 4),
      change('safety', -2),
      flag('visible_at_work'),
      days(110),
    ]),
  },
  {
    id: 'life-1934-neighbor-request',
    speaker: 'Anna Keller',
    role: 'Komşun',
    line: 'Bir süredir işlerim kötü gidiyor. Birkaç hafta idare edebilmem için bana borç verebilir misin?',
    weight: 4,
    left: choice('decline-loan', 'Bu kez olmaz', 'Kendi bütçeni koru.', [
      change('money', 1),
      change('social', -2),
      days(55),
    ]),
    right: choice('help-neighbor', 'Elimden geleni yaparım', 'Bir miktar para ver ve komşuluk bağını güçlendir.', [
      change('money', -3),
      change('social', 4),
      flag('helped_anna'),
      days(55),
    ]),
  },
  {
    id: 'life-1935-anna-returns',
    speaker: 'Anna Keller',
    role: 'Komşun',
    line: 'Geçen yıl bana yardım etmiştin. Şimdi benim çalıştığım yerde sana ek iş ayarlayabilirim.',
    minDate: '1935-01-01',
    requires: { helped_anna: true },
    weight: 10,
    left: choice('decline-side-job', 'Gerek yok', 'Mevcut düzenini bozma.', [
      change('safety', 1),
      change('social', 1),
      days(70),
    ]),
    right: choice('take-side-job', 'Deneyebilirim', 'Ek gelir için daha yoğun bir çalışma temposuna gir.', [
      change('money', 4),
      change('social', -2),
      flag('second_job'),
      days(80),
    ]),
  },
  {
    id: 'life-1935-newspaper-friend',
    speaker: 'Ernst Keller',
    role: 'Gazeteci tanıdığın',
    line: 'İnsanların günlük hayatını anlatan kısa yazılar hazırlıyorum. Senin yaşadıklarını da yazıya dökmek isterim.',
    minDate: '1935-01-01',
    maxDate: '1939-12-31',
    weight: 5,
    left: choice('stay-private', 'Adımı kullanma', 'Hikâyeni paylaş ama görünürlüğünü sınırlı tut.', [
      change('safety', 2),
      change('reputation', -1),
      flag('press_contact'),
      days(65),
    ]),
    right: choice('go-public', 'Adımı yazabilirsin', 'Daha görünür olmayı kabul et.', [
      change('reputation', 4),
      change('safety', -2),
      flag('press_contact'),
      flag('public_profile'),
      days(65),
    ]),
  },
  {
    id: 'life-1936-public-invitation',
    speaker: 'Ernst Keller',
    role: 'Gazeteci tanıdığın',
    line: 'Yazı beklediğimden fazla ilgi gördü. Seni küçük bir söyleşiye çağırıyorlar. Katılmak ister misin?',
    minDate: '1936-01-01',
    requires: { public_profile: true },
    weight: 11,
    left: choice('avoid-interview', 'Geri çekileyim', 'Görünürlüğünü azalt.', [
      change('safety', 3),
      change('reputation', -2),
      days(70),
    ]),
    right: choice('attend-interview', 'Katılacağım', 'Kamusal görünürlüğünü artır.', [
      change('reputation', 5),
      change('social', 2),
      change('safety', -3),
      flag('known_locally'),
      days(75),
    ]),
  },
  {
    id: 'life-1936-family-move',
    speaker: 'Elise',
    role: 'Aileden biri',
    line: 'Şehir giderek yorucu geliyor. Daha küçük bir yere taşınmayı düşünüyorum. Sen de gelir misin?',
    minDate: '1936-01-01',
    maxDate: '1940-12-31',
    weight: 4,
    left: choice('stay-city', 'Burada kalacağım', 'Mevcut iş ve çevre bağlarını koru.', [
      change('money', 1),
      change('reputation', 1),
      change('social', -1),
      flag('left_family_behind'),
      days(120),
    ]),
    right: choice('move-with-family', 'Birlikte gidelim', 'Kariyer bağlarının bir kısmını bırakıp aileye yakın kal.', [
      change('social', 4),
      change('safety', 2),
      change('money', -2),
      flag('moved_with_family'),
      days(130),
    ]),
  },
  {
    id: 'life-1937-business-offer',
    speaker: 'Herr Braun',
    role: 'Tanıdık bir esnaf',
    line: 'Küçük dükkânıma ortak arıyorum. Birikimin varsa birlikte büyütebiliriz.',
    minDate: '1937-01-01',
    weight: 5,
    left: choice('keep-savings', 'Paramı riske atmam', 'Birikimini koru.', [
      change('safety', 2),
      change('money', 1),
      days(90),
    ]),
    right: choice('join-business', 'Ortak olalım', 'Birikimini yeni bir işe bağla.', [
      change('money', -3),
      change('reputation', 3),
      change('social', 2),
      flag('owns_business'),
      days(120),
    ]),
  },
  {
    id: 'life-1938-business-growth',
    speaker: 'Herr Braun',
    role: 'İş ortağın',
    line: 'Dükkân beklediğimizden iyi gidiyor. Daha büyük bir yere geçebiliriz ama borçlanmamız gerekecek.',
    minDate: '1938-01-01',
    requires: { owns_business: true },
    weight: 10,
    left: choice('keep-small-shop', 'Küçük kalalım', 'Daha düşük riskle devam et.', [
      change('safety', 2),
      change('money', 1),
      days(105),
    ]),
    right: choice('expand-shop', 'Büyütelim', 'Gelir ihtimali için daha büyük risk al.', [
      change('money', 5),
      change('safety', -3),
      change('reputation', 3),
      flag('business_expanded'),
      days(130),
    ]),
  },
  {
    id: 'life-1939-war-news',
    speaker: 'Friedrich',
    role: 'Eski arkadaşın',
    line: 'Herkes önümüzdeki ayların hayatımızı değiştireceğini konuşuyor. Birikim yapıp daha temkinli yaşamaya başlayalım mı?',
    minDate: '1939-09-01',
    maxDate: '1941-12-31',
    weight: 12,
    left: choice('keep-normal-life', 'Hayatımı değiştirmem', 'Günlük düzenini koru.', [
      change('social', 2),
      change('safety', -2),
      days(120),
    ]),
    right: choice('prepare-household', 'Daha temkinli olalım', 'Harcamaları kıs ve güvenliğe öncelik ver.', [
      change('money', 2),
      change('safety', 4),
      change('social', -2),
      flag('prepared_household'),
      days(120),
    ]),
  },
  {
    id: 'life-1940-work-shortage',
    speaker: 'Bay Weber',
    role: 'İşverenin',
    line: 'İş düzeni değişiyor. Daha uzun çalışırsan yerini koruyabilirsin; istemezsen başka birini bulmam gerekecek.',
    minDate: '1940-01-01',
    requires: { steady_job: true },
    weight: 8,
    left: choice('refuse-long-hours', 'Bu kadar çalışamam', 'Boş zamanını koru ama gelir riskini artır.', [
      change('social', 3),
      change('money', -3),
      change('reputation', -1),
      flag('job_insecure'),
      days(100),
    ]),
    right: choice('accept-long-hours', 'Kabul ediyorum', 'Geliri koru ama sosyal hayatından vazgeç.', [
      change('money', 3),
      change('social', -4),
      change('safety', 1),
      days(100),
    ]),
  },
  {
    id: 'life-1941-friend-leaves',
    speaker: 'Friedrich',
    role: 'Eski arkadaşın',
    line: 'Bir süreliğine şehirden ayrılmaya karar verdim. İstersen benimle gelebilirsin.',
    minDate: '1941-01-01',
    maxDate: '1943-12-31',
    weight: 5,
    left: choice('remain-home', 'Burada kalacağım', 'Kurulu hayatını koru.', [
      change('reputation', 1),
      change('social', -3),
      flag('friend_left'),
      days(140),
    ]),
    right: choice('leave-city', 'Seninle geliyorum', 'İş ve çevrenin bir kısmını bırakıp yeni bir başlangıç yap.', [
      change('safety', 4),
      change('money', -3),
      change('social', 2),
      flag('left_city'),
      days(160),
    ]),
  },
  {
    id: 'life-1942-old-contact',
    speaker: 'Ernst Keller',
    role: 'Eski gazeteci tanıdığın',
    line: 'Uzun zamandır görüşmedik. Çevrem daraldı; güvendiğim birkaç kişiden biri sensin. Arada buluşalım mı?',
    minDate: '1942-01-01',
    requires: { press_contact: true },
    weight: 9,
    left: choice('keep-distance', 'Mesafeyi koruyalım', 'Eski bağlantıyı zayıflat ama daha temkinli kal.', [
      change('safety', 3),
      change('social', -2),
      days(85),
    ]),
    right: choice('keep-contact', 'Görüşmeye devam edelim', 'Eski dostluğu koru.', [
      change('social', 4),
      change('safety', -2),
      flag('loyal_to_ernst'),
      days(85),
    ]),
  },
  {
    id: 'life-1943-housing-damage',
    speaker: 'Belediye görevlisi',
    role: 'Yerel görevli',
    line: 'Mahallendeki bazı evler artık kullanılamıyor. Geçici olarak başka bir bölgede kalman gerekebilir.',
    minDate: '1943-01-01',
    weight: 7,
    left: choice('stay-nearby', 'Yakında bir yer bulurum', 'Çevrenden kopmamaya çalış.', [
      change('money', -3),
      change('social', 2),
      change('safety', -2),
      days(110),
    ]),
    right: choice('accept-relocation', 'Başka bölgeye geçeyim', 'Daha güvenli bir yere taşın ama çevrenden uzaklaş.', [
      change('safety', 4),
      change('social', -3),
      flag('relocated'),
      days(120),
    ]),
  },
  {
    id: 'life-1944-family-choice',
    speaker: 'Elise',
    role: 'Aileden biri',
    line: 'Bu dönemi ayrı geçirmek istemiyorum. İmkânımız varsa aynı yerde kalalım.',
    minDate: '1944-01-01',
    weight: 7,
    left: choice('prioritize-work', 'İşimi bırakamam', 'Geliri ve mevcut düzeni koru.', [
      change('money', 2),
      change('social', -4),
      change('reputation', 1),
      days(120),
    ]),
    right: choice('prioritize-family', 'Birlikte kalalım', 'Maddi kayba rağmen aile bağını öne çıkar.', [
      change('money', -3),
      change('social', 5),
      change('safety', 1),
      flag('family_together'),
      days(120),
    ]),
  },
  {
    id: 'life-1945-next-step',
    speaker: 'Anna Keller',
    role: 'Eski komşun',
    line: 'Eski düzen artık geride kalıyor. Burada kalıp yeniden mi başlayacaksın, yoksa başka bir yere mi gideceksin?',
    minDate: '1945-01-01',
    weight: 20,
    left: choice('rebuild-here', 'Burada yeniden başlarım', 'Kalan çevrenle bulunduğun yerde yeni bir hayat kurmayı seç.', [
      change('social', 3),
      change('reputation', 2),
      flag('rebuild_here'),
      days(150),
    ]),
    right: choice('start-elsewhere', 'Başka yere gideceğim', 'Eski bağların bir kısmını bırakıp başka yerde yeni bir hayat ara.', [
      change('safety', 3),
      change('money', -2),
      flag('start_elsewhere'),
      days(150),
    ]),
  },
];

function flagsMatch(card: LifeCardDefinition, snapshot: GameSessionSnapshot): boolean {
  if (!card.requires) return true;
  return Object.entries(card.requires).every(
    ([key, expected]) => (snapshot.state.flags[key] ?? false) === expected,
  );
}

function dateMatches(card: LifeCardDefinition, currentDate: string): boolean {
  if (card.minDate && currentDate < card.minDate) return false;
  if (card.maxDate && currentDate > card.maxDate) return false;
  return true;
}

function hashScore(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function cardScore(card: LifeCardDefinition, snapshot: GameSessionSnapshot): number {
  const historyKey = snapshot.decisionHistory.map((item) => item.optionId).join('|');
  const randomish = hashScore(`${snapshot.state.sessionId}|${historyKey}|${card.id}`);
  return randomish / Math.max(1, card.weight ?? 1);
}

function toEvent(card: LifeCardDefinition, snapshot: GameSessionSnapshot): HistoricalEvent {
  return createHistoricalEvent({
    id: card.id,
    eraId: snapshot.state.selection.eraId,
    countryIds: [snapshot.state.selection.countryId],
    title: card.line,
    summary: card.line,
    startDate: snapshot.state.currentDate,
    scope: 'NATIONAL',
    classification: 'COUNTERFACTUAL_SIMULATION',
    sortOrder: snapshot.decisionHistory.length + 1,
    status: 'PUBLISHED',
  });
}

function fallbackCard(snapshot: GameSessionSnapshot): LifeCardDefinition {
  const index = snapshot.decisionHistory.length;
  const variants: LifeCardDefinition[] = [
    {
      id: `life-routine-${index}`,
      speaker: 'Friedrich',
      role: 'Eski arkadaşın',
      line: 'Uzun zamandır yalnızca iş ve günlük koşuşturmayla uğraşıyoruz. Bu hafta sonu biraz insan içine karışalım mı?',
      left: choice('rest-alone', 'Biraz yalnız kalayım', 'Dinlenip masraf yapma.', [
        change('money', 1),
        change('social', -2),
        change('safety', 1),
        days(75),
      ]),
      right: choice('meet-people', 'Hadi çıkalım', 'Çevrenle bağını güçlendir.', [
        change('money', -1),
        change('social', 3),
        change('reputation', 1),
        days(75),
      ]),
    },
    {
      id: `life-routine-${index}`,
      speaker: 'Elise',
      role: 'Aileden biri',
      line: 'Bir süredir yorgun görünüyorsun. Daha az çalışıp kendine zaman ayırmayı düşünür müsün?',
      left: choice('keep-working', 'Böyle devam ederim', 'Geliri koru ama sosyal hayatı geri plana at.', [
        change('money', 2),
        change('social', -2),
        days(80),
      ]),
      right: choice('slow-down', 'Biraz yavaşlayayım', 'Gelirden vazgeçip daha dengeli yaşa.', [
        change('money', -2),
        change('social', 2),
        change('safety', 1),
        days(80),
      ]),
    },
    {
      id: `life-routine-${index}`,
      speaker: 'Bay Hoffmann',
      role: 'Mahalleden bir tanıdık',
      line: 'Mahallede herkes birbirini tanıyor. Bir toplantıya uğrarsan yeni insanlarla tanışabilirsin.',
      left: choice('skip-meeting', 'Bu kez gitmeyeyim', 'Daha görünmez kal.', [
        change('safety', 2),
        change('reputation', -1),
        days(70),
      ]),
      right: choice('attend-meeting', 'Uğrarım', 'Yeni insanlarla tanış ve görünürlüğünü artır.', [
        change('social', 2),
        change('reputation', 2),
        change('safety', -1),
        days(70),
      ]),
    },
  ];

  return variants[index % variants.length];
}

export function getActiveGermanyLifeCard(
  snapshot: GameSessionSnapshot,
): ActiveLifeCard {
  const decidedIds = new Set(snapshot.decisionHistory.map((item) => item.eventId));
  const eligible = LIFE_CARDS
    .filter((card) => !decidedIds.has(card.id))
    .filter((card) => dateMatches(card, snapshot.state.currentDate))
    .filter((card) => flagsMatch(card, snapshot))
    .sort((a, b) => cardScore(a, snapshot) - cardScore(b, snapshot));

  const card = eligible[0] ?? fallbackCard(snapshot);
  return { card, event: toEvent(card, snapshot) };
}
