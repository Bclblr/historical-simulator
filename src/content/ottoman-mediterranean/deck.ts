import type { DecisionEffect, GameSessionSnapshot } from '@/domain/game';
import { createHistoricalEvent, type HistoricalEvent } from '@/domain/history';

export interface MediterraneanChoice {
  idSuffix: string;
  label: string;
  description: string;
  effects: DecisionEffect[];
}

export interface MediterraneanCardDefinition {
  id: string;
  speaker: string;
  role?: string;
  line: string;
  left: MediterraneanChoice;
  right: MediterraneanChoice;
  minDate?: string;
  maxDate?: string;
  requires?: Record<string, boolean>;
  weight?: number;
  category: 'PORT' | 'SEA' | 'INTELLIGENCE' | 'FAMILY' | 'CAPTIVITY' | 'TRADE' | 'IDENTITY';
}

export interface ActiveMediterraneanCard {
  event: HistoricalEvent;
  card: MediterraneanCardDefinition;
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
): MediterraneanChoice => ({ idSuffix, label, description, effects });

const C = (id: string, speaker: string, role: string, line: string, category: MediterraneanCardDefinition['category'], left: MediterraneanChoice, right: MediterraneanChoice, extra: Partial<MediterraneanCardDefinition> = {}): MediterraneanCardDefinition => ({
  id,
  speaker,
  role,
  line,
  category,
  left,
  right,
  weight: 5,
  ...extra,
});

const MEDITERRANEAN_CARDS: MediterraneanCardDefinition[] = [
  C('med-port-first-work','Niko','Liman işçisi','Limanın kalabalığı içinde bir ambar sahibi sana düzenli iş teklif ediyor. Kabul edersen denize daha az çıkacaksın.','PORT',
    choice('stay-casual','Günübirlik çalışırım','Özgürlüğünü koru ama gelirin düzensiz kalsın.',[change('money',2),change('portReputation',2),days(90)]),
    choice('take-warehouse','Düzenli işe girerim','Daha düzenli gelir karşılığında limana bağlan.',[change('money',4),change('safety',2),flag('warehouse_worker'),days(120)])),
  C('med-port-sailor','Mateo','Denizci','Bir geminin tayfası eksik. Denizi biliyorsan seni hemen alabileceklerini söylüyorlar.','SEA',
    choice('stay-ashore','Karada kalırım','Liman çevresindeki bağlantılarını büyüt.',[change('portReputation',3),change('social',2),days(100)]),
    choice('join-crew','Tayfaya katılırım','Deniz hayatına gir ve yeni insanlarla tanış.',[change('sailorNetwork',3),change('safety',-2),flag('sailor'),days(140)])),
  C('med-family-letter','Meryem','Aileden biri','Ailenden gelen mektupta para sıkıntısından söz ediliyor. Ne yapacaksın?','FAMILY',
    choice('send-money','Payıma düşeni gönderirim','Kendi bütçeni azaltıp aile bağını güçlendir.',[change('money',-3),change('familyTies',4),flag('supports_family'),days(110)]),
    choice('keep-money','Şimdilik gönderemem','Kendi geleceğini güvenceye almaya çalış.',[change('money',2),change('familyTies',-2),days(110)])),
  C('med-merchant-contact','Hassan','Tüccar','Bir tüccar, farklı limanlarda iş yapan tanıdıklarının olduğunu söylüyor. Küçük bir iş teklif ediyor.','TRADE',
    choice('decline-trade','Girmeyeyim','Riskten uzak dur.',[change('safety',2),days(120)]),
    choice('carry-message','Mesajını götürürüm','Limanlar arasındaki ticari ağı öğren.',[change('merchantNetwork',3),change('money',3),flag('merchant_contact'),days(130)])),
  C('med-strange-question','Yusuf','Tanımadığın denizci','Sana hangi limanlarda çalıştığını ve son seferinde neler gördüğünü soruyor. Soruları sıradan görünmüyor.','INTELLIGENCE',
    choice('answer-casually','Bildiğimi anlatırım','Bilgi paylaşmanın karşılığında küçük bir yakınlık kazan.',[change('intelligenceNetwork',2),change('safety',-2),flag('spoke_to_contact'),days(70)]),
    choice('avoid-details','Ayrıntıya girmem','Kendini daha az görünür tut.',[change('safety',3),change('social',-1),days(70)])),
  C('med-hidden-letter','Yusuf','Eski bağlantı','Bir mektubu başka bir limana ulaştırman isteniyor. İçeriğini bilmiyorsun.','INTELLIGENCE',
    choice('refuse-letter','Ben taşımam','Şüpheli bir işe karışma.',[change('safety',3),change('intelligenceNetwork',-1),days(90)]),
    choice('carry-letter','Götürürüm','Bağlantının güvenini kazan.',[change('intelligenceNetwork',4),change('reputation',2),flag('carried_message'),days(100)]),
    { requires: { spoke_to_contact: true }, minDate:'1551-01-01' }),
  C('med-contact-reward','Yusuf','Eski bağlantı','Mektup yerine ulaştı. Sana para teklif ediyorlar; fakat bunun yalnızca bir teşekkür olmadığını hissediyorsun.','INTELLIGENCE',
    choice('take-no-money','Para almam','Mesafeni koru.',[change('safety',2),change('intelligenceNetwork',1),days(80)]),
    choice('take-payment','Ödemeyi alırım','Maddi kazanç sağla ve ağdaki yerini güçlendir.',[change('money',4),change('intelligenceNetwork',3),change('safety',-2),flag('paid_information'),days(80)]),
    { requires:{ carried_message:true }, weight:8 }),
  C('med-port-rumor','Salih','Liman kahvesindeki tanıdık','Limanın ötesindeki gelişmeler hakkında herkes farklı bir şey anlatıyor. Sen ne yapacaksın?','PORT',
    choice('listen','Sadece dinlerim','Söylentileri ayırmaya çalış.',[change('information',2),change('social',2),days(60)]),
    choice('repeat-rumor','Ben de anlatırım','Çevredeki görünürlüğünü artır ama bilginin güvenilirliği azalabilir.',[change('social',3),change('reputation',-2),change('information',1),days(60)])),
  C('med-trader-credit','Hassan','Tüccar','Bir sonraki iş için sermaye gerekiyor. Sana güvenip borç verebileceğini söylüyor.','TRADE',
    choice('avoid-debt','Borçlanmam','Daha yavaş büyü ama yük altına girme.',[change('safety',2),days(140)]),
    choice('take-credit','Borç alırım','Ticaret çevreni büyüt ve borçlan.',[change('money',5),change('debt',5),change('merchantNetwork',2),flag('merchant_debt'),days(170)]),
    { requires:{ merchant_contact:true }, weight:8 }),
  C('med-ship-discipline','Rafael','Gemi sorumlusu','Gemide herkesin işi farklı. Günlük düzen konusunda anlaşmazlık çıktı.','SEA',
    choice('support-order','Düzeni desteklerim','Tayfa içindeki güveni ve düzeni koru.',[change('shipTrust',3),change('safety',2),days(80)]),
    choice('side-with-crew','Tayfanın yanındayım','Tayfa bağlarını güçlendir ama üstlerle gerilim yarat.',[change('sailorNetwork',3),change('shipTrust',-2),days(80)]),
    { requires:{ sailor:true }, weight:8 }),
  C('med-ship-supplies','Rafael','Gemi sorumlusu','Uzun bir deniz yolculuğu için erzak düzenleniyor. Bazı ihtiyaçlar beklenenden pahalı.','SEA',
    choice('save-supplies','Tasarruf edelim','Kaynakları daha dikkatli kullan.',[change('money',2),change('safety',-1),days(120)]),
    choice('secure-supplies','Eksik bırakmayalım','Daha fazla harcayıp gemideki güvenliği öncele.',[change('money',-2),change('safety',4),change('shipTrust',2),days(120)]),
    { requires:{ sailor:true }, weight:7 }),
  C('med-ship-illness','Rafael','Gemi sorumlusu','Yolculuk uzadı. Gemide hastalık ve yorgunluk konuşulmaya başlandı.','SEA',
    choice('rest','Dinlenmeye çekilirim','Kendi sağlığını ve güvenliğini öncele.',[change('safety',3),change('shipTrust',-1),days(60)]),
    choice('help-crew','Tayfaya yardım ederim','Mürettebatla dayanışmanı artır.',[change('shipTrust',4),change('safety',-2),days(60)]),
    { requires:{ sailor:true }, weight:9 }),
  C('med-foreign-sailor','Giovanni','Yabancı denizci','Tayfadan biri farklı bir dil konuşuyor. Birbirinizi anlamakta zorlanıyorsunuz ama bazı bilgileri yalnızca o biliyor.','IDENTITY',
    choice('learn-words','Dilini öğrenmeye çalışırım','Yeni bir iletişim kanalı kazan.',[change('language',3),change('sailorNetwork',2),days(100)]),
    choice('keep-distance','Mesafemi korurum','Güvenli ama sınırlı bir ilişki kur.',[change('safety',1),days(100)]),
    { requires:{ sailor:true }, weight:8 }),
  C('med-corsair-offer','Kaptan Selim','Gemi kaptanı','Liman dönüşünde daha kazançlı bir deniz işine katılman teklif ediliyor. İşin niteliği ve riski hakkında herkes aynı şeyi söylemiyor.','SEA',
    choice('stay-merchant-sea','Ticaret gemilerinde kalırım','Daha öngörülebilir bir deniz hayatını seç.',[change('merchantNetwork',3),change('safety',2),days(160)]),
    choice('join-new-crew','Yeni tayfaya katılırım','Daha belirsiz ama daha geniş bir deniz çevresine gir.',[change('sailorNetwork',4),change('safety',-3),flag('corsair_network'),days(180)]),
    { requires:{ sailor:true }, weight:9 }),
  C('med-captain-trust','Kaptan Selim','Kaptanın','Sana artık bazı işleri tek başına emanet ediyor. Bu güveni nasıl kullanacaksın?','SEA',
    choice('keep-low-profile','Görünür olmayayım','Güven kazan ama dikkat çekme.',[change('shipTrust',3),change('reputation',1),days(100)]),
    choice('take-responsibility','Sorumluluk alırım','Daha fazla söz sahibi ol.',[change('shipTrust',5),change('reputation',3),change('safety',-2),flag('crew_responsibility'),days(100)]),
    { requires:{ corsair_network:true }, weight:8 }),
  C('med-information-trader','Hassan','Tüccar','Bir tüccar senden başka bir limandaki piyasa ve gemi hareketleri hakkında duyduklarını anlatmanı istiyor.','INTELLIGENCE',
    choice('share-general','Genel şeyler söylerim','Sadece zaten herkesin konuştuğu bilgileri paylaş.',[change('merchantNetwork',2),change('information',2),days(90)]),
    choice('share-specific','Ayrıntı veririm','Daha değerli bilgi karşılığında daha büyük bir ödeme al.',[change('money',5),change('intelligenceNetwork',3),change('safety',-3),days(90)]),
    { requires:{ merchant_contact:true }, weight:8 }),
  C('med-counter-watch','Mehmet','Liman görevlisi','Son zamanlarda kimlerle görüştüğün soruluyor. Soru basit görünse de geçmişteki bazı bağlantıların hatırlatılıyor.','INTELLIGENCE',
    choice('answer-openly','Açıkça anlatırım','Şeffaflıkla şüpheyi azaltmaya çalış.',[change('safety',2),change('intelligenceNetwork',-1),days(80)]),
    choice('say-little','Az konuşurum','Kendini koru ama şüpheyi tamamen ortadan kaldıramazsın.',[change('safety',-1),change('intelligenceNetwork',2),days(80)]),
    { requires:{ paid_information:true }, minDate:'1553-01-01', weight:10 }),
  C('med-coded-note','Yusuf','Eski bağlantı','Bu kez sana kısa ve anlaşılması güç bir not gösteriyor. Ne istediğini doğrudan söylemiyor.','INTELLIGENCE',
    choice('decline','Bu işin içinde yokum','Bağlantıyı zayıflat ama riskini azalt.',[change('safety',3),change('intelligenceNetwork',-2),days(100)]),
    choice('ask-context','Ne olduğunu öğrenmek isterim','Daha fazla bilgi iste ve ağdaki yerini ilerlet.',[change('intelligenceNetwork',4),change('information',3),change('safety',-2),days(100)]),
    { requires:{ intelligenceNetwork:true }, weight:9 }),
  C('med-counterintelligence','Mehmet','Liman görevlisi','Bir başka kişi hakkında soruşturma yürütülüyor. Senden onu daha önce görüp görmediğin soruluyor.','INTELLIGENCE',
    choice('tell-truth','Bildiğimi söylerim','Soruşturmaya açıkça cevap ver.',[change('safety',2),change('reputation',1),days(90)]),
    choice('protect-contact','Hatırlamıyorum derim','Bağlantını koru ama soruşturmanın dikkatini çekebilirsin.',[change('intelligenceNetwork',3),change('safety',-4),flag('protected_contact'),days(90)]),
    { requires:{ intelligenceNetwork:true }, weight:10 }),
  C('med-family-absence','Meryem','Aileden biri','Uzun süredir denizdesin. Ailen artık seni daha sık görmek istiyor.','FAMILY',
    choice('return-family','Bir süre karada kalırım','Aile bağını güçlendir.',[change('familyTies',5),change('sailorNetwork',-2),change('safety',2),days(180)]),
    choice('stay-at-sea','Denizde kalacağım','Deniz çevresini koru ama aileden uzaklaş.',[change('sailorNetwork',3),change('familyTies',-3),days(180)]),
    { requires:{ sailor:true }, weight:8 }),
  C('med-family-marriage','Meryem','Aileden biri','Ailen, hayatını daha düzenli hale getirmeni istiyor. Kararı sana bırakıyorlar.','FAMILY',
    choice('settle-down','Karada düzen kuracağım','Aile ve liman hayatını öne çıkar.',[change('familyTies',5),change('safety',3),change('sailorNetwork',-1),flag('settled_family'),days(240)]),
    choice('keep-roaming','Denizi bırakamam','Hareketli hayatını sürdür.',[change('sailorNetwork',3),change('familyTies',-2),days(240)]),
    { weight:7 }),
  C('med-debt-call','Hassan','Tüccar','Eski borcun hâlâ kapanmadı. Yeni bir iş teklif ederek borcu çevirmeyi öneriyor.','TRADE',
    choice('pay-slowly','Yavaş yavaş öderim','Borcu azalt ve riskten uzaklaş.',[change('debt',-5),change('money',-2),change('safety',2),days(180)]),
    choice('roll-debt','Yeni iş alırım','Borcu büyütme ihtimaline rağmen çevrede kal.',[change('debt',4),change('merchantNetwork',3),change('money',4),days(180)]),
    { requires:{ merchant_debt:true }, weight:9 }),
  C('med-captivity','Anonim','Esirlikten dönen biri','Bir limanda yıllarca süren esaretin ardından dönmüş bir adam, hayatın bir anda değişebileceğini anlatıyor.','CAPTIVITY',
    choice('listen-only','Sadece dinlerim','Esaret deneyiminin sosyal ve ekonomik etkilerini anlamaya çalış.',[change('information',3),change('safety',2),days(70)]),
    choice('offer-help','Yardım teklif ederim','Onun yeniden çevre kurmasına destek ol.',[change('social',3),change('reputation',2),change('familyTies',1),days(70)]),
    { weight:6 }),
  C('med-captive-choice','Mühtedi Ahmed','Esaretten dönmüş denizci','Geçmişini değiştirmiş bir denizci, yeni hayatının eski çevresinden çok farklı olduğunu söylüyor. Sana güvenip hikâyesini anlatıyor.','IDENTITY',
    choice('respect-distance','Sınırlarına saygı duyarım','Kişisel geçmişini sorgulamadan ilişki kur.',[change('social',3),change('information',2),days(100)]),
    choice('ask-about-worlds','Daha çok sorarım','Farklı çevreler arasında nasıl yaşadığını anlamaya çalış.',[change('language',2),change('information',4),days(100)]),
    { weight:8 }),
  C('med-capture','Kaptan Selim','Kaptanın','Denizde bir çatışmanın ardından gemidekilerin bir kısmı esir düştü. Sen kurtuldun ama düzen tamamen değişti.','CAPTIVITY',
    choice('return-ashore','Karaya dönerim','Denizden uzaklaşıp hayatını yeniden kur.',[change('safety',5),change('sailorNetwork',-4),flag('survived_capture'),days(240)]),
    choice('stay-sea','Denize devam ederim','Yaşananlardan sonra yine denize dön.',[change('safety',-3),change('sailorNetwork',4),flag('survived_capture'),days(240)]),
    { requires:{ sailor:true }, weight:11 }),
  C('med-ransom','Hassan','Tüccar','Esaret yaşamış birinin yakınları fidye ve masraflar için yardım arıyor.','CAPTIVITY',
    choice('contribute','Katkıda bulunurum','Maddi yük üstlenip topluluk bağını güçlendir.',[change('money',-3),change('social',4),change('reputation',2),days(120)]),
    choice('stay-out','Karışmayayım','Kendi kaynaklarını koru.',[change('money',2),change('safety',1),days(120)]),
    { requires:{ survived_capture:true }, weight:8 }),
  C('med-new-identity','Ahmed','Yeni çevreden tanıdık','Geçmişteki hayatınla bugünkü hayatın arasında seçim yapman gerektiğini hissediyorsun.','IDENTITY',
    choice('keep-past','Geçmişimi korurum','Aile ve eski çevre bağlarını sürdür.',[change('familyTies',4),change('social',2),days(180)]),
    choice('build-new','Yeni hayat kurarım','Yeni çevrenin dilini ve alışkanlıklarını öğren.',[change('language',4),change('social',3),change('familyTies',-3),flag('new_identity_network'),days(180)]),
    { requires:{ survived_capture:true }, weight:8 }),
  C('med-port-authority','Mehmet','Liman görevlisi','Liman kayıtlarında adın daha sık görünmeye başladı. Bazıları seni güvenilir buluyor, bazıları ise fazla hareketli.','PORT',
    choice('reduce-visits','Daha az görünür olurum','Liman çevresinde daha temkinli davran.',[change('safety',4),change('portReputation',-2),days(150)]),
    choice('embrace-network','Bağlantılarımı kullanırım','Liman ağındaki nüfuzunu artır.',[change('portReputation',5),change('social',2),change('safety',-2),days(150)]),
    { weight:9 }),
  C('med-language-gain','Giovanni','Eski denizci tanıdığın','Birden fazla dili kullanabilmen artık işlerini kolaylaştırıyor. Sana yeni bir aracılık fırsatı doğuyor.','IDENTITY',
    choice('use-for-trade','Ticarette kullanırım','Dillerini ticari bağlantılara dönüştür.',[change('merchantNetwork',4),change('money',3),days(180)]),
    choice('use-for-information','Bilgi için kullanırım','Farklı çevrelerden haber almayı kolaylaştır.',[change('intelligenceNetwork',4),change('information',3),days(180)]),
    { requires:{ language:true }, weight:8 }),
  C('med-informant-choice','Yusuf','Eski bağlantı','Sana düzenli bilgi aktaran küçük bir çevre kurulabileceğini söylüyor. Bu çevrenin parçası olmak isteyip istemediğin soruluyor.','INTELLIGENCE',
    choice('stay-independent','Bağımsız kalırım','Ağdan yararlan ama merkezine girme.',[change('information',3),change('safety',2),days(200)]),
    choice('join-network','Ağın parçası olurum','Bilgi akışının daha derin bir parçası haline gel.',[change('intelligenceNetwork',6),change('reputation',2),change('safety',-3),flag('deep_intelligence'),days(200)]),
    { requires:{ intelligenceNetwork:true }, weight:11 }),
  C('med-network-test','Mehmet','Liman görevlisi','Senden küçük bir bilgi isteniyor. Bunu kimin için kullanacaklarını söylemiyorlar.','INTELLIGENCE',
    choice('refuse-test','Benden bilgi çıkmaz','Bağlantının riskini azalt.',[change('safety',4),change('intelligenceNetwork',-1),days(120)]),
    choice('answer-test','Bildiğimi söylerim','Ağın içindeki güveni artır.',[change('intelligenceNetwork',5),change('safety',-3),days(120)]),
    { requires:{ deep_intelligence:true }, weight:10 }),
  C('med-counterattack','Mehmet','Liman görevlisi','Geçmişte konuştuğun kişilerden biri hakkında yeni sorular soruluyor. Bu kez sen de soruşturmanın kapsamını anlamaya çalışıyorsun.','INTELLIGENCE',
    choice('cooperate','İşbirliği yaparım','Kendini açıkça ortaya koy.',[change('safety',2),change('intelligenceNetwork',-3),change('reputation',2),days(140)]),
    choice('withhold','Bilgiyi saklarım','Ağını koru ama riskini artır.',[change('intelligenceNetwork',4),change('safety',-5),days(140)]),
    { requires:{ deep_intelligence:true }, weight:11 }),
  C('med-retirement-trade','Hassan','Eski tüccar ortağın','Artık sürekli denize çıkmak yerine kıyıda daha düzenli bir ticaret hayatı kurabilirsin.','TRADE',
    choice('retire-sea','Karaya geçerim','Ticaret ve aile bağlarına yönel.',[change('merchantNetwork',4),change('safety',4),change('sailorNetwork',-3),flag('shore_life'),days(300)]),
    choice('one-more-voyage','Bir sefer daha','Deniz çevreni bırakma.',[change('sailorNetwork',4),change('money',4),change('safety',-3),days(300)]),
    { requires:{ merchant_contact:true }, weight:8 }),
  C('med-old-friend','Meryem','Aileden biri','Yıllar geçti. Ailen senin hakkında “artık yerleşecek mi?” diye konuşuyor.','FAMILY',
    choice('return-home','Eve dönüyorum','Aile çevreni hayatının merkezine al.',[change('familyTies',6),change('safety',3),flag('family_center'),days(260)]),
    choice('continue-life','Hayatım böyle','Hareketli hayatını sürdür.',[change('sailorNetwork',2),change('familyTies',-2),days(260)]),
    { weight:7 }),
  C('med-final-network','Yusuf','Eski bağlantı','Yıllar önce verdiğin küçük bir bilginin bugün hâlâ konuşulduğunu öğreniyorsun.','INTELLIGENCE',
    choice('walk-away','Artık yeter','Geçmiş bağlantılarını kapatmaya çalış.',[change('safety',5),change('intelligenceNetwork',-4),days(300)]),
    choice('stay-connected','Bağımı koparmam','Eski ağın içinde kal.',[change('intelligenceNetwork',5),change('reputation',2),change('safety',-3),days(300)]),
    { requires:{ intelligenceNetwork:true }, minDate:'1580-01-01', weight:10 }),
  C('med-final-port','Salih','Liman kahvesindeki tanıdık','Liman artık sana eskisinden farklı görünüyor. Gençliğinde tanıdığın insanların çoğu başka yerlere dağıldı.','PORT',
    choice('teach-young','Gençlere bildiklerimi aktarırım','Deneyimini yeni kuşağa bırak.',[change('social',5),change('reputation',3),flag('mentor'),days(260)]),
    choice('quiet-retirement','Sessizce çekilirim','Daha sakin bir hayat seç.',[change('safety',5),change('social',-2),days(260)]),
    { weight:8 }),
  C('med-final-family','Meryem','Aileden biri','Hayatının son döneminde geriye baktığında hangi bağın yanında kalmasını istiyorsun?','FAMILY',
    choice('family-first','Aile','Aile bağlarını son kez güçlendir.',[change('familyTies',7),change('social',3),days(240)]),
    choice('world-first','Dünya ve deniz','Hayatını şekillendiren hareketli çevreyi koru.',[change('sailorNetwork',3),change('merchantNetwork',2),days(240)]),
    { weight:8 }),
];

function hashScore(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967296;
}

function matches(card: MediterraneanCardDefinition, snapshot: GameSessionSnapshot): boolean {
  const date = snapshot.state.currentDate;
  if (card.minDate && date < card.minDate) return false;
  if (card.maxDate && date > card.maxDate) return false;
  return Object.entries(card.requires ?? {}).every(([key, required]) =>
    snapshot.state.flags[key] === required || (required && (snapshot.state.variables[key] ?? 0) > 0),
  );
}

function score(card: MediterraneanCardDefinition, snapshot: GameSessionSnapshot): number {
  const history = snapshot.decisionHistory.map((item) => item.optionId).join('|');
  const recent = snapshot.decisionHistory.slice(-5).map((item) => item.eventId);
  const sameCategory = snapshot.decisionHistory
    .slice(-4)
    .map((item) => MEDITERRANEAN_CARDS.find((cardItem) => cardItem.id === item.eventId))
    .some((item) => item?.category === card.category);
  const sameSpeaker = snapshot.decisionHistory
    .slice(-4)
    .map((item) => MEDITERRANEAN_CARDS.find((cardItem) => cardItem.id === item.eventId))
    .some((item) => item?.speaker === card.speaker);
  return (
    hashScore(`${snapshot.state.sessionId}|${history}|${card.id}`) / Math.max(1, card.weight ?? 1) +
    (recent.includes(card.id) ? 2 : 0) +
    (sameCategory ? 0.2 : 0) +
    (sameSpeaker ? 0.7 : 0)
  );
}

function toEvent(card: MediterraneanCardDefinition, snapshot: GameSessionSnapshot): HistoricalEvent {
  return createHistoricalEvent({
    id: card.id,
    eraId: snapshot.state.selection.eraId,
    countryIds: [snapshot.state.selection.countryId],
    institutionIds: [snapshot.state.selection.institutionId],
    title: card.line,
    summary: card.line,
    startDate: snapshot.state.currentDate,
    scope: 'INTERNATIONAL',
    classification: 'COUNTERFACTUAL_SIMULATION',
    sortOrder: snapshot.decisionHistory.length + 1,
    status: 'PUBLISHED',
  });
}

const FALLBACKS: MediterraneanCardDefinition[] = [
  C('med-fallback-port','Liman sakini','Tanıdık','Bugün liman her zamankinden sakin. İnsanların arasına karışıp günü nasıl geçireceksin?','PORT',
    choice('watch','İzlerim','Çevreyi ve insanları gözlemle.',[change('information',2),days(90)]),
    choice('work','Çalışırım','Günlük kazancını artır.',[change('money',2),change('portReputation',1),days(90)])),
  C('med-fallback-family','Meryem','Aileden biri','Ailenle geçirdiğin sıradan bir günün değerini fark ediyorsun.','FAMILY',
    choice('stay','Yanlarında kalırım','Aile bağını güçlendir.',[change('familyTies',3),change('social',2),days(100)]),
    choice('leave','İşime dönerim','Kendi hayatının peşinden git.',[change('money',2),change('familyTies',-1),days(100)])),
];

export function getActiveOttomanMediterraneanCard(snapshot: GameSessionSnapshot): ActiveMediterraneanCard {
  const decided = new Set(snapshot.decisionHistory.map((item) => item.eventId));
  const eligible = MEDITERRANEAN_CARDS
    .filter((card) => !decided.has(card.id))
    .filter((card) => matches(card, snapshot))
    .sort((a, b) => score(a, snapshot) - score(b, snapshot));

  const card = eligible[0] ?? FALLBACKS[snapshot.decisionHistory.length % FALLBACKS.length];
  return { card, event: toEvent(card, snapshot) };
}
