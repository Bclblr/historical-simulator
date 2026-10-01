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
  category?: 'HISTORY' | 'WORK' | 'SOCIAL' | 'FAMILY' | 'SURVIVAL';
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
,
  {
    id: 'life-1933-boycott',
    speaker: 'Herr Rosenfeld',
    role: 'Mahalle esnafı',
    line: 'Dükkânımın önünde bugün insanları içeri girmemeleri için durduruyorlar. Yine de alışverişe girecek misin?',
    minDate: '1933-04-01',
    maxDate: '1933-12-31',
    weight: 14,
    category: 'HISTORY',
    left: choice('walk-away-boycott', 'Bugün uzaklaşayım', 'Dikkat çekmeden yoluna devam et.', [
      change('safety', 2),
      change('social', -2),
      days(45),
    ]),
    right: choice('enter-shop-boycott', 'Alışveriş yapacağım', 'Baskıya rağmen dükkâna gir.', [
      change('social', 3),
      change('reputation', -2),
      change('safety', -2),
      flag('supported_rosenfeld'),
      days(45),
    ]),
  },
  {
    id: 'life-1933-dismissed-neighbor',
    speaker: 'Dr. Adler',
    role: 'Eski komşun',
    line: 'Kamu görevindeki işimi kaybettim. Bir süre mektuplarımı senin adresine göndermeme izin verir misin?',
    minDate: '1933-04-07',
    maxDate: '1934-12-31',
    weight: 12,
    category: 'HISTORY',
    left: choice('refuse-mail', 'Beni karıştırma', 'Kendi güvenliğini öne çıkar.', [
      change('safety', 2),
      change('social', -2),
      days(55),
    ]),
    right: choice('receive-mail', 'Adresimi kullanabilirsin', 'Komşuna küçük ama görünür bir yardım yap.', [
      change('social', 3),
      change('safety', -2),
      flag('helped_adler'),
      days(55),
    ]),
  },
  {
    id: 'life-1933-book-burning',
    speaker: 'Lotte',
    role: 'Üniversiteden tanıdığın',
    line: 'Bazı kitapların meydanda yakılacağını söylüyorlar. Ben birkaçını saklamak istiyorum. Senin evinde dursunlar mı?',
    minDate: '1933-05-01',
    maxDate: '1934-06-30',
    weight: 10,
    category: 'HISTORY',
    left: choice('refuse-books', 'Evime getirme', 'Riskten uzak dur.', [
      change('safety', 2),
      change('social', -1),
      days(50),
    ]),
    right: choice('keep-books', 'Birkaçını sakla', 'Lotte ile bağını koru ama görünmez bir risk al.', [
      change('social', 2),
      change('safety', -2),
      flag('kept_books'),
      days(50),
    ]),
  },
  {
    id: 'life-1935-nuremberg-laws',
    speaker: 'Anna Keller',
    role: 'Komşun',
    line: 'Yeni ırk yasaları yüzünden Rosenfeld ailesinin hayatı daha da zorlaştı. Onlarla görüşmeye devam edecek misin?',
    minDate: '1935-09-15',
    maxDate: '1937-12-31',
    weight: 15,
    category: 'HISTORY',
    left: choice('distance-rosenfeld', 'Mesafemi korurum', 'Kamusal baskıdan uzak dur.', [
      change('safety', 3),
      change('social', -2),
      days(70),
    ]),
    right: choice('keep-friendship', 'Görüşmeye devam ederim', 'Eski ilişkinizi sürdür.', [
      change('social', 4),
      change('safety', -2),
      flag('kept_rosenfeld_friendship'),
      days(70),
    ]),
  },
  {
    id: 'life-1936-olympics',
    speaker: 'Friedrich',
    role: 'Eski arkadaşın',
    line: 'Berlin yabancı ziyaretçilerle doldu. Şehir kendini bambaşka gösteriyor. Birkaç günlüğüne gidip bakalım mı?',
    minDate: '1936-07-15',
    maxDate: '1936-09-15',
    weight: 14,
    category: 'HISTORY',
    left: choice('skip-olympics', 'Burada kalalım', 'Masraf yapmadan günlük düzenini sürdür.', [
      change('money', 2),
      change('social', -1),
      days(45),
    ]),
    right: choice('visit-olympics', 'Berlin’e gidelim', 'Kalabalık ve görünür bir etkinliğe katıl.', [
      change('money', -2),
      change('social', 3),
      change('reputation', 2),
      days(45),
    ]),
  },
  {
    id: 'life-1937-food-shortage',
    speaker: 'Elise',
    role: 'Aileden biri',
    line: 'Bazı yiyecekleri bulmak giderek zorlaşıyor. Biraz para ayırıp erzak biriktirelim mi?',
    minDate: '1937-01-01',
    maxDate: '1939-08-31',
    weight: 8,
    category: 'SURVIVAL',
    left: choice('buy-normally', 'Günlük alalım', 'Paranı elde tut.', [
      change('money', 2),
      change('safety', -1),
      days(65),
    ]),
    right: choice('stock-food', 'Biraz stok yapalım', 'Bütçeden vazgeçip evde erzak tut.', [
      change('money', -3),
      change('safety', 3),
      flag('food_stock'),
      days(65),
    ]),
  },
  {
    id: 'life-1938-pogrom-aftermath',
    speaker: 'Anna Keller',
    role: 'Komşun',
    line: 'Dün gece Rosenfeldlerin dükkânı da zarar gördü. Sabah kapılarının önünde bekliyorlar. Yanlarına gidecek misin?',
    minDate: '1938-11-10',
    maxDate: '1939-03-31',
    weight: 18,
    category: 'HISTORY',
    left: choice('stay-away-aftermath', 'Uzakta kalacağım', 'Dikkat çekmemeyi seç.', [
      change('safety', 3),
      change('social', -3),
      days(45),
    ]),
    right: choice('visit-rosenfeld', 'Yanlarına gideceğim', 'Komşuluk bağını sürdür.', [
      change('social', 4),
      change('safety', -3),
      flag('visited_rosenfeld_after_1938'),
      days(45),
    ]),
  },
  {
    id: 'life-1939-ration-cards',
    speaker: 'Bakkal Schmidt',
    role: 'Mahalle bakkalı',
    line: 'Savaş başlayınca dağıtım değişti. Kartlarını dikkatli kullanmazsan ay sonunu zor getirirsin. Harcamaları kısacak mısın?',
    minDate: '1939-09-01',
    maxDate: '1941-12-31',
    weight: 13,
    category: 'SURVIVAL',
    left: choice('spend-rations', 'Şimdilik idare ederiz', 'Bugünü rahat geçir ama rezervini azalt.', [
      change('social', 2),
      change('safety', -3),
      days(65),
    ]),
    right: choice('save-rations', 'Daha dikkatli olalım', 'Günlük rahatlıktan vazgeçip rezerv tut.', [
      change('money', 2),
      change('safety', 3),
      change('social', -1),
      flag('careful_rations'),
      days(65),
    ]),
  },
  {
    id: 'life-1939-blackout',
    speaker: 'Blok görevlisi',
    role: 'Mahalle görevlisi',
    line: 'Geceleri pencerelerden ışık görünmemesi isteniyor. Perdelerini yenilemen gerekecek.',
    minDate: '1939-09-01',
    maxDate: '1942-12-31',
    weight: 9,
    category: 'HISTORY',
    left: choice('delay-blackout', 'Sonra yaparım', 'Masrafı ertele ama dikkat çekme riskini artır.', [
      change('money', 1),
      change('reputation', -2),
      change('safety', -2),
      days(50),
    ]),
    right: choice('prepare-blackout', 'Hemen hallederim', 'Evi karartma kurallarına uygun hâle getir.', [
      change('money', -2),
      change('safety', 3),
      change('reputation', 1),
      flag('blackout_ready'),
      days(50),
    ]),
  },
  {
    id: 'life-1940-shortages',
    speaker: 'Elise',
    role: 'Aileden biri',
    line: 'Meyve, sebze ve gündelik bazı ürünleri bulmak zorlaştı. Pazarı dolaşıp saatler harcayalım mı?',
    minDate: '1940-01-01',
    maxDate: '1942-12-31',
    weight: 10,
    category: 'SURVIVAL',
    left: choice('accept-shortage', 'Elimizdekiler yeter', 'Zamanını koru ama evdeki imkânlarla yetin.', [
      change('social', 1),
      change('safety', -1),
      days(60),
    ]),
    right: choice('search-markets', 'Biraz daha arayalım', 'Daha çok zaman ve para harcayarak ihtiyaç bulmaya çalış.', [
      change('money', -2),
      change('safety', 2),
      change('social', -1),
      days(60),
    ]),
  },
  {
    id: 'life-1941-yellow-star',
    speaker: 'Herr Rosenfeld',
    role: 'Eski komşun',
    line: 'Artık sokağa çıktığımda herkes beni işaret eden yıldızı görüyor. Birlikte yürümek seni rahatsız eder mi?',
    minDate: '1941-09-19',
    maxDate: '1942-12-31',
    requires: { kept_rosenfeld_friendship: true },
    weight: 18,
    category: 'HISTORY',
    left: choice('avoid-public-walk', 'Evde görüşelim', 'Arkadaşlığı sürdür ama kamusal görünürlüğü azalt.', [
      change('safety', 2),
      change('social', 1),
      days(55),
    ]),
    right: choice('walk-together', 'Birlikte yürürüz', 'Kamusal baskıya rağmen arkadaşlığını gizleme.', [
      change('social', 4),
      change('safety', -3),
      change('reputation', -2),
      flag('publicly_stood_by_rosenfeld'),
      days(55),
    ]),
  },
  {
    id: 'life-1942-rosenfeld-disappears',
    speaker: 'Anna Keller',
    role: 'Komşun',
    line: 'Rosenfeld ailesinin kapısı günlerdir kapalı. Mahallede götürüldüklerini söyleyenler var. Eşyalarından kalanları koruyalım mı?',
    minDate: '1942-01-01',
    maxDate: '1943-12-31',
    requires: { kept_rosenfeld_friendship: true },
    weight: 16,
    category: 'HISTORY',
    left: choice('do-not-interfere', 'Karışmayalım', 'Dikkat çekmemeyi seç.', [
      change('safety', 3),
      change('social', -3),
      days(70),
    ]),
    right: choice('protect-belongings', 'Kalanları saklayalım', 'Komşularının eşyalarını korumaya çalış.', [
      change('social', 3),
      change('safety', -2),
      flag('protected_rosenfeld_belongings'),
      days(70),
    ]),
  },
  {
    id: 'life-1943-total-war',
    speaker: 'Bay Weber',
    role: 'İşverenin',
    line: 'İşyerine daha fazla üretim hedefi geldi. Vardiyalar uzayacak. Ek vardiyayı alırsan gelirini korursun.',
    minDate: '1943-02-01',
    maxDate: '1944-12-31',
    weight: 12,
    category: 'WORK',
    left: choice('refuse-extra-war-shift', 'Ek vardiyayı istemiyorum', 'Sosyal hayatını koru ama gelirden vazgeç.', [
      change('money', -3),
      change('social', 3),
      change('reputation', -2),
      days(75),
    ]),
    right: choice('take-extra-war-shift', 'Vardiyayı alırım', 'Geliri koru ama zamanını işe bağla.', [
      change('money', 4),
      change('social', -4),
      change('reputation', 2),
      days(75),
    ]),
  },
  {
    id: 'life-1943-air-raid',
    speaker: 'Elise',
    role: 'Aileden biri',
    line: 'Hava saldırısı uyarıları artık daha sık. Geceyi her alarmda sığınağa inmeye hazır geçirelim mi?',
    minDate: '1943-01-01',
    maxDate: '1945-04-30',
    weight: 18,
    category: 'SURVIVAL',
    left: choice('stay-home-during-alerts', 'Her seferinde inmeyelim', 'Günlük düzeni koru ama daha fazla risk al.', [
      change('social', 1),
      change('safety', -4),
      days(55),
    ]),
    right: choice('use-shelter', 'Alarmda sığınağa ineriz', 'Uyarıları ciddiye al ve güvenliğe öncelik ver.', [
      change('safety', 4),
      change('social', -2),
      flag('uses_shelter'),
      days(55),
    ]),
  },
  {
    id: 'life-1943-bombed-neighbor',
    speaker: 'Friedrich',
    role: 'Eski arkadaşın',
    line: 'Dün geceki saldırıdan sonra Hoffmannların evi kullanılamaz durumda. Birkaç hafta bizde kalsınlar mı?',
    minDate: '1943-01-01',
    maxDate: '1945-04-30',
    weight: 11,
    category: 'SOCIAL',
    left: choice('cannot-host-family', 'Yerimiz yok', 'Ev düzenini koru.', [
      change('safety', 1),
      change('social', -2),
      days(60),
    ]),
    right: choice('host-family', 'Birlikte idare ederiz', 'Evini paylaş ve çevrendeki bağı güçlendir.', [
      change('money', -2),
      change('social', 4),
      change('safety', -1),
      flag('hosted_bombed_family'),
      days(60),
    ]),
  },
  {
    id: 'life-1944-evacuation',
    speaker: 'Belediye görevlisi',
    role: 'Yerel görevli',
    line: 'Çocuklu ailelerin bir bölümünü daha güvenli bölgelere göndermeye çalışıyoruz. Ailenden gidecek olanlarla sen de ayrılacak mısın?',
    minDate: '1944-01-01',
    maxDate: '1945-03-31',
    weight: 14,
    category: 'SURVIVAL',
    left: choice('remain-city-1944', 'Şehirde kalacağım', 'İşini ve yerleşik düzenini koru.', [
      change('money', 2),
      change('safety', -4),
      change('social', -1),
      days(90),
    ]),
    right: choice('leave-city-1944', 'Onlarla giderim', 'İşi bırakıp güvenliğe öncelik ver.', [
      change('money', -3),
      change('safety', 5),
      change('social', 2),
      flag('evacuated_1944'),
      days(90),
    ]),
  },
  {
    id: 'life-1945-return-home',
    speaker: 'Friedrich',
    role: 'Eski arkadaşın',
    line: 'Cephe yaklaşırken herkes geleceğini düşünüyor. Savaş bittiğinde ilk iş eski evine mi döneceksin, yoksa yeni bir yerde mi kalacaksın?',
    minDate: '1945-01-01',
    maxDate: '1945-05-07',
    weight: 15,
    category: 'FAMILY',
    left: choice('plan-return-home', 'Eski mahalleme dönerim', 'Eski bağlarını yeniden kurmaya hazırlan.', [
      change('social', 3),
      change('reputation', 1),
      flag('plans_return_home'),
      days(45),
    ]),
    right: choice('plan-new-place', 'Yeni bir yerde kalırım', 'Geçmiş bağların yerine güvenliği seç.', [
      change('safety', 3),
      change('social', -2),
      flag('plans_new_place'),
      days(45),
    ]),
  }
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

  const recentEventIds = snapshot.decisionHistory
    .slice(-4)
    .map((item) => item.eventId);
  const recentCards = recentEventIds
    .map((id) => LIFE_CARDS.find((item) => item.id === id))
    .filter((item): item is LifeCardDefinition => Boolean(item));
  const sameSpeakerRecently = recentCards.some((item) => item.speaker === card.speaker);
  const sameCategoryRecently = card.category
    ? recentCards.some((item) => item.category === card.category)
    : false;

  return (
    randomish / Math.max(1, card.weight ?? 1) +
    (sameSpeakerRecently ? 0.7 : 0) +
    (sameCategoryRecently ? 0.22 : 0)
  );
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
  const templates: Omit<LifeCardDefinition, 'id'>[] = [
    {
      speaker: 'Friedrich',
      role: 'Eski arkadaşın',
      line: 'Mahalle kahvesinde herkes son siyasi değişiklikleri konuşuyor. Bu akşam kalabalığa karışacak mısın?',
      category: 'SOCIAL',
      left: choice('avoid-cafe-talk', 'Bu akşam gitmeyeyim', 'Daha görünmez kal.', [
        change('safety', 2), change('social', -2), days(55),
      ]),
      right: choice('join-cafe-talk', 'Bir uğrayayım', 'Çevrendeki konuşmaları dinle.', [
        change('social', 3), change('reputation', 1), change('safety', -1), days(55),
      ]),
    },
    {
      speaker: 'Elise',
      role: 'Aileden biri',
      line: 'Gazeteler her gün başka bir resmî duyuru yayımlıyor. Aboneliği sürdürelim mi, yoksa masraftan kaçınalım mı?',
      category: 'FAMILY',
      left: choice('cancel-paper', 'Gazeteyi bırakalım', 'Paranı koru.', [
        change('money', 2), change('reputation', -1), days(60),
      ]),
      right: choice('keep-paper', 'Takip etmeye devam edelim', 'Gündemi yakından takip et.', [
        change('money', -1), change('reputation', 1), days(60),
      ]),
    },
    {
      speaker: 'Bakkal Schmidt',
      role: 'Mahalle bakkalı',
      line: 'Bazı ürünler yine gelmedi. İstersen sana ayırdığım son paketi verebilirim.',
      category: 'SURVIVAL',
      left: choice('leave-last-package', 'Başkasına kalsın', 'Paranı koru ve çevrendeki ilişkiyi güçlendir.', [
        change('money', 1), change('social', 2), days(50),
      ]),
      right: choice('take-last-package', 'Alırım', 'Evdeki ihtiyacı öncele.', [
        change('money', -2), change('safety', 2), days(50),
      ]),
    },
    {
      speaker: 'Bay Weber',
      role: 'İşverenin',
      line: 'İşyerinde yeni kurallar asıldı. Herkesin zamanında gelip daha sıkı çalışması bekleniyor.',
      category: 'WORK',
      left: choice('work-minimum', 'Sadece işimi yaparım', 'Fazladan görünür olma.', [
        change('safety', 1), change('reputation', -1), days(65),
      ]),
      right: choice('work-extra', 'Biraz daha yük alırım', 'İşyerindeki konumunu güçlendir.', [
        change('money', 2), change('reputation', 2), change('social', -2), days(65),
      ]),
    },
    {
      speaker: 'Anna Keller',
      role: 'Komşun',
      line: 'Mahallede insanlar kimin kiminle görüştüğüne daha çok dikkat ediyor. Akşam yine beraber oturalım mı?',
      category: 'SOCIAL',
      left: choice('keep-distance-evening', 'Bu akşam olmaz', 'Dikkat çekmemeyi seç.', [
        change('safety', 2), change('social', -2), days(55),
      ]),
      right: choice('visit-anna-evening', 'Gelirim', 'Komşuluk bağını koru.', [
        change('social', 3), change('safety', -1), days(55),
      ]),
    },
    {
      speaker: 'Herr Hoffmann',
      role: 'Mahalleden bir tanıdık',
      line: 'Resmî törene herkesin katılması bekleniyor. Seni de listede görmek istiyorlar.',
      category: 'HISTORY',
      left: choice('skip-public-ceremony', 'Katılmayacağım', 'Kalabalıktan uzak dur.', [
        change('safety', -1), change('reputation', -2), days(50),
      ]),
      right: choice('attend-public-ceremony', 'Uğrarım', 'Görünürlüğünü koru.', [
        change('reputation', 2), change('social', 1), days(50),
      ]),
    },
    {
      speaker: 'Elise',
      role: 'Aileden biri',
      line: 'Evdeki bütçeyi yeniden hesapladım. Bir süre dışarıda daha az vakit geçirsek para biriktirebiliriz.',
      category: 'FAMILY',
      left: choice('keep-social-spending', 'Hayatı kısmayalım', 'Çevreni koru.', [
        change('social', 2), change('money', -2), days(70),
      ]),
      right: choice('save-household-money', 'Biraz kısalım', 'Parayı ve güvenliği öne çıkar.', [
        change('money', 3), change('social', -2), days(70),
      ]),
    },
    {
      speaker: 'Friedrich',
      role: 'Eski arkadaşın',
      line: 'Bir tanıdık başka şehre taşındı ve odasını boş bıraktı. Daha ucuz bir eve geçmek ister misin?',
      category: 'SOCIAL',
      left: choice('stay-current-home', 'Burada kalayım', 'Mevcut çevreni koru.', [
        change('social', 2), change('money', -1), days(80),
      ]),
      right: choice('take-cheaper-room', 'Taşınayım', 'Masrafı azalt ama çevrenden biraz uzaklaş.', [
        change('money', 3), change('social', -2), days(80),
      ]),
    },
    {
      speaker: 'Bay Weber',
      role: 'İşverenin',
      line: 'Bir iş arkadaşın ayrıldı. Onun görevlerinin bir kısmını üstlenirsen haftalık ücretin artacak.',
      category: 'WORK',
      left: choice('refuse-extra-duty', 'Yeterince işim var', 'Boş zamanını koru.', [
        change('social', 2), change('money', -1), days(70),
      ]),
      right: choice('take-extra-duty', 'Üstlenirim', 'Geliri artır ama daha fazla çalış.', [
        change('money', 3), change('social', -2), change('reputation', 1), days(70),
      ]),
    },
    {
      speaker: 'Anna Keller',
      role: 'Komşun',
      line: 'Mahallede yeni gelen bir aile kimseyi tanımıyor. Akşam yemeğine çağıralım mı?',
      category: 'SOCIAL',
      left: choice('do-not-invite-family', 'Bu kez olmasın', 'Kendi düzenini koru.', [
        change('safety', 1), change('social', -1), days(60),
      ]),
      right: choice('invite-new-family', 'Çağıralım', 'Çevreni genişlet.', [
        change('social', 3), change('money', -1), days(60),
      ]),
    },
    {
      speaker: 'Bakkal Schmidt',
      role: 'Mahalle bakkalı',
      line: 'Fiyatlar yine değişti. Daha ucuz ama kalitesi düşük mallara mı geçeceksin?',
      category: 'SURVIVAL',
      left: choice('buy-better-goods', 'Az alıp iyisini alırım', 'Daha çok harca.', [
        change('money', -2), change('safety', 1), days(55),
      ]),
      right: choice('buy-cheaper-goods', 'Ucuz olan yeter', 'Bütçeyi koru.', [
        change('money', 2), change('safety', -1), days(55),
      ]),
    },
    {
      speaker: 'Friedrich',
      role: 'Eski arkadaşın',
      line: 'Uzun zamandır aynı insanlarla görüşüyoruz. Yeni bir çevreye karışmanın zamanı geldi mi?',
      category: 'SOCIAL',
      left: choice('keep-old-circle', 'Eski çevrem yeter', 'Mevcut bağlarını koru.', [
        change('social', 1), change('safety', 1), days(65),
      ]),
      right: choice('meet-new-circle', 'Yeni insanlarla tanışayım', 'Çevreni ve görünürlüğünü artır.', [
        change('social', 3), change('reputation', 2), change('safety', -1), days(65),
      ]),
    },
  ];

  const recentIds = snapshot.decisionHistory.slice(-5).map((item) => item.eventId);
  const ranked = templates
    .map((template, templateIndex) => ({
      template,
      templateIndex,
      score: hashScore(`${snapshot.state.sessionId}|${index}|${templateIndex}`) +
        (recentIds.some((id) => id.includes(`routine-${templateIndex}-`)) ? 2 : 0),
    }))
    .sort((a, b) => a.score - b.score);

  const selected = ranked[0];
  return {
    ...selected.template,
    id: `life-routine-${selected.templateIndex}-${index}`,
  };
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

  const finalChoice =
    snapshot.state.currentDate >= '1945-01-01'
      ? eligible.find((card) => card.id === 'life-1945-next-step')
      : undefined;

  const card = finalChoice ?? eligible[0] ?? fallbackCard(snapshot);
  return { card, event: toEvent(card, snapshot) };
}
