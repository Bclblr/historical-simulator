import type { DecisionEffect, GameSessionSnapshot } from '@/domain/game';
import { createHistoricalEvent, type HistoricalEvent } from '@/domain/history';
import { EXPANDED_MEDITERRANEAN_CARDS } from './expanded-cards';
import { REIGNS_SCALE_CARDS } from './reigns-scale-cards';
import { HISTORICAL_MEDITERRANEAN_CARDS } from './historical-spine';

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
  C('med-port-first-work','Niko','Liman işçisi','Ambar sahibi: Her sabah burada olursan sana düzenli iş veririm. Denize çıkmak yerine karada kalırsın.','PORT',
    choice('stay-casual','Günübirlik çalışmamı mı öneriyorsun?','Özgürlüğünü koru ama gelirin düzensiz kalsın.',[change('money',2),change('portReputation',2),days(90)]),
    choice('take-warehouse','Bu işe girmemi mi öneriyorsun?','Daha düzenli gelir karşılığında limana bağlan.',[change('money',4),change('safety',2),flag('warehouse_worker'),days(120)])),
  C('med-port-sailor','Mateo','Denizci','Mateo: Tayfamız eksik. Denizi biliyorsan bugün bizimle gelebilirsin. Karada kalıp iş aramak da senin seçimin.','SEA',
    choice('stay-ashore','Karada kalmam daha mı iyi?','Liman çevresindeki bağlantılarını büyüt.',[change('portReputation',3),change('social',2),days(100)]),
    choice('join-crew','Tayfaya katılırım','Deniz hayatına gir ve yeni insanlarla tanış.',[change('sailorNetwork',3),change('safety',-2),flag('sailor'),days(140)])),
  C('med-family-letter','Meryem','Aileden biri','Meryem: Evden haber geldi. Para sıkıntısı çekiyoruz. Elinden geleni gönderebilir misin?','FAMILY',
    choice('send-money','Payıma düşeni gönderirim','Kendi bütçeni azaltıp aile bağını güçlendir.',[change('money',-3),change('familyTies',4),flag('supports_family'),days(110)]),
    choice('keep-money','Şimdilik gönderemem','Kendi geleceğini güvenceye almaya çalış.',[change('money',2),change('familyTies',-2),days(110)])),
  C('med-merchant-contact','Hassan','Tüccar','Hassan: Başka limanlarda tanıdıklarım var. Küçük bir iş yaparsan sana da pay verebilirim.','TRADE',
    choice('decline-trade','Girmeyeyim','Riskten uzak dur.',[change('safety',2),days(120)]),
    choice('carry-message','Mesajını götürürüm','Limanlar arasındaki ticari ağı öğren.',[change('merchantNetwork',3),change('money',3),flag('merchant_contact'),days(130)])),
  C('med-strange-question','Yusuf','Tanımadığın denizci','Yusuf: Hangi limanlara gittin? Son seferinde neler gördün? Sadece merak ettiğimi sanma.','INTELLIGENCE',
    choice('answer-casually','Bildiğimi anlatırım','Bilgi paylaşmanın karşılığında küçük bir yakınlık kazan.',[change('intelligenceNetwork',2),change('safety',-2),flag('spoke_to_contact'),days(70)]),
    choice('avoid-details','Ayrıntıya girmem','Kendini daha az görünür tut.',[change('safety',3),change('social',-1),days(70)])),
  C('med-hidden-letter','Yusuf','Eski bağlantı','Yusuf: Şu mektubu öteki limana götürür müsün? İçinde ne olduğunu sorma. Ulaştığında kime vereceğini sana söylerim.','INTELLIGENCE',
    choice('refuse-letter','Ben taşımam','Şüpheli bir işe karışma.',[change('safety',3),change('intelligenceNetwork',-1),days(90)]),
    choice('carry-letter','Götürürüm','Bağlantının güvenini kazan.',[change('intelligenceNetwork',4),change('reputation',2),flag('carried_message'),days(100)]),
    { requires: { spoke_to_contact: true }, minDate:'1551-01-01' }),
  C('med-contact-reward','Yusuf','Eski bağlantı','Yusuf: Mektup yerine ulaştı. Bunun karşılığında sana ödeme yapacağız. Ama bunun yalnızca bir teşekkür olmadığını sen de biliyorsun.','INTELLIGENCE',
    choice('take-no-money','Para almam','Mesafeni koru.',[change('safety',2),change('intelligenceNetwork',1),days(80)]),
    choice('take-payment','Ödemeyi alırım','Maddi kazanç sağla ve ağdaki yerini güçlendir.',[change('money',4),change('intelligenceNetwork',3),change('safety',-2),flag('paid_information'),days(80)]),
    { requires:{ carried_message:true }, weight:8 }),
  C('med-port-rumor','Salih','Liman kahvesindeki tanıdık','Salih: Herkes başka bir şey söylüyor. Sen ne duydun? Bildiğin bir şey varsa anlat.','PORT',
    choice('listen','Sadece dinlerim','Söylentileri ayırmaya çalış.',[change('information',2),change('social',2),days(60)]),
    choice('repeat-rumor','Ben de anlatırım','Çevredeki görünürlüğünü artır ama bilginin güvenilirliği azalabilir.',[change('social',3),change('reputation',-2),change('information',1),days(60)])),
  C('med-trader-credit','Hassan','Tüccar','Hassan: Yeni iş için sermaye lazım. Sana borç verebilirim. Ama zamanında geri ödeyeceğine güvenmem gerekiyor.','TRADE',
    choice('avoid-debt','Borçlanmam','Daha yavaş büyü ama yük altına girme.',[change('safety',2),days(140)]),
    choice('take-credit','Borç alırım','Ticaret çevreni büyüt ve borçlan.',[change('money',5),change('debt',5),change('merchantNetwork',2),flag('merchant_debt'),days(170)]),
    { requires:{ merchant_contact:true }, weight:8 }),
  C('med-ship-discipline','Rafael','Gemi sorumlusu','Rafael: Gemide herkes kendi işini yapıyor ama düzen bozulmaya başladı. Sen bu konuda kimin yanında duracaksın?','SEA',
    choice('support-order','Düzeni desteklerim','Tayfa içindeki güveni ve düzeni koru.',[change('shipTrust',3),change('safety',2),days(80)]),
    choice('side-with-crew','Tayfanın yanındayım','Tayfa bağlarını güçlendir ama üstlerle gerilim yarat.',[change('sailorNetwork',3),change('shipTrust',-2),days(80)]),
    { requires:{ sailor:true }, weight:8 }),
  C('med-ship-supplies','Rafael','Gemi sorumlusu','Rafael: Yol uzun. Erzak pahalıya çıktı. Ya tasarruf edeceğiz ya da eksikleri tamamlayacağız. Ne diyorsun?','SEA',
    choice('save-supplies','Tasarruf edelim','Kaynakları daha dikkatli kullan.',[change('money',2),change('safety',-1),days(120)]),
    choice('secure-supplies','Eksik bırakmayalım','Daha fazla harcayıp gemideki güvenliği öncele.',[change('money',-2),change('safety',4),change('shipTrust',2),days(120)]),
    { requires:{ sailor:true }, weight:7 }),
  C('med-ship-illness','Rafael','Gemi sorumlusu','Rafael: Yol uzadı. Tayfa yoruldu. Hastalık da baş gösteriyor. Sen dinlenmek mi istiyorsun, yoksa diğerlerine yardım mı edeceksin?','SEA',
    choice('rest','Dinlenmeye çekilirim','Kendi sağlığını ve güvenliğini öncele.',[change('safety',3),change('shipTrust',-1),days(60)]),
    choice('help-crew','Tayfaya yardım ederim','Mürettebatla dayanışmanı artır.',[change('shipTrust',4),change('safety',-2),days(60)]),
    { requires:{ sailor:true }, weight:9 }),
  C('med-foreign-sailor','Giovanni','Yabancı denizci','Giovanni: Dilimizi konuşmuyorsun. Ben de seninkini bilmiyorum. Ama gördüğüm bazı şeyleri senden önce duyman gerekebilir.','IDENTITY',
    choice('learn-words','Dilini öğrenmeye çalışırım','Yeni bir iletişim kanalı kazan.',[change('language',3),change('sailorNetwork',2),days(100)]),
    choice('keep-distance','Mesafemi korurum','Güvenli ama sınırlı bir ilişki kur.',[change('safety',1),days(100)]),
    { requires:{ sailor:true }, weight:8 }),
  C('med-corsair-offer','Kaptan Selim','Gemi kaptanı','Kaptan Selim: Daha kazançlı bir sefere çıkacağız. Bunun ne kadar riskli olduğu konusunda herkes aynı fikirde değil. Bizimle misin?','SEA',
    choice('stay-merchant-sea','Ticaret gemilerinde kalırım','Daha öngörülebilir bir deniz hayatını seç.',[change('merchantNetwork',3),change('safety',2),days(160)]),
    choice('join-new-crew','Yeni tayfaya katılırım','Daha belirsiz ama daha geniş bir deniz çevresine gir.',[change('sailorNetwork',4),change('safety',-3),flag('corsair_network'),days(180)]),
    { requires:{ sailor:true }, weight:9 }),
  C('med-captain-trust','Kaptan Selim','Kaptanın','Kaptan Selim: Bazı işleri artık sana tek başına bırakıyorum. Bu güveni nasıl kullanacağını görmek istiyorum.','SEA',
    choice('keep-low-profile','Görünür olmayayım','Güven kazan ama dikkat çekme.',[change('shipTrust',3),change('reputation',1),days(100)]),
    choice('take-responsibility','Sorumluluk alırım','Daha fazla söz sahibi ol.',[change('shipTrust',5),change('reputation',3),change('safety',-2),flag('crew_responsibility'),days(100)]),
    { requires:{ corsair_network:true }, weight:8 }),
  C('med-information-trader','Hassan','Tüccar','Hassan: Öteki limanda fiyatlar nasıl? Hangi gemiler geldi, hangileri ayrıldı? Duyduklarını benimle paylaşır mısın?','INTELLIGENCE',
    choice('share-general','Genel şeyler söylerim','Sadece zaten herkesin konuştuğu bilgileri paylaş.',[change('merchantNetwork',2),change('information',2),days(90)]),
    choice('share-specific','Ayrıntı veririm','Daha değerli bilgi karşılığında daha büyük bir ödeme al.',[change('money',5),change('intelligenceNetwork',3),change('safety',-3),days(90)]),
    { requires:{ merchant_contact:true }, weight:8 }),
  C('med-counter-watch','Mehmet','Liman görevlisi','Mehmet: Son zamanlarda kimlerle görüştüğünü biliyoruz. Daha önce görüştüğün bazı insanlar da soruluyor. Bana açıkça anlat.','INTELLIGENCE',
    choice('answer-openly','Açıkça anlatırım','Şeffaflıkla şüpheyi azaltmaya çalış.',[change('safety',2),change('intelligenceNetwork',-1),days(80)]),
    choice('say-little','Az konuşurum','Kendini koru ama şüpheyi tamamen ortadan kaldıramazsın.',[change('safety',-1),change('intelligenceNetwork',2),days(80)]),
    { requires:{ paid_information:true }, minDate:'1553-01-01', weight:10 }),
  C('med-coded-note','Yusuf','Eski bağlantı','Yusuf: Buna bak. Ne yazdığını açıkça söylemeyeceğim. Sen ne anlıyorsun?','INTELLIGENCE',
    choice('decline','Bu işin içinde yokum','Bağlantıyı zayıflat ama riskini azalt.',[change('safety',3),change('intelligenceNetwork',-2),days(100)]),
    choice('ask-context','Ne olduğunu öğrenmek isterim','Daha fazla bilgi iste ve ağdaki yerini ilerlet.',[change('intelligenceNetwork',4),change('information',3),change('safety',-2),days(100)]),
    { requires:{ intelligenceNetwork:true }, weight:9 }),
  C('med-counterintelligence','Mehmet','Liman görevlisi','Mehmet: Şu adamı daha önce gördün mü? Sana yalnızca bunu soruyorum. Cevabını iyi düşün.','INTELLIGENCE',
    choice('tell-truth','Bildiğimi söylerim','Soruşturmaya açıkça cevap ver.',[change('safety',2),change('reputation',1),days(90)]),
    choice('protect-contact','Hatırlamıyorum derim','Bağlantını koru ama soruşturmanın dikkatini çekebilirsin.',[change('intelligenceNetwork',3),change('safety',-4),flag('protected_contact'),days(90)]),
    { requires:{ intelligenceNetwork:true }, weight:10 }),
  C('med-family-absence','Meryem','Aileden biri','Meryem: Yine aylar geçti. Evdekiler seni görmek istiyor. Bir süre karada kalmayı düşünür müsün?','FAMILY',
    choice('return-family','Eve dönmemi mi istiyorsunuz?','Aile bağını güçlendir.',[change('familyTies',5),change('sailorNetwork',-2),change('safety',2),days(180)]),
    choice('stay-at-sea','Denizi bırakmamı mı bekliyorsunuz?','Deniz çevresini koru ama aileden uzaklaş.',[change('sailorNetwork',3),change('familyTies',-3),days(180)]),
    { requires:{ sailor:true }, weight:8 }),
  C('med-family-marriage','Meryem','Aileden biri','Meryem: Artık hayatını düzene koymanın zamanı gelmedi mi? Kararı biz vermeyeceğiz. Sen ne istiyorsun?','FAMILY',
    choice('settle-down','Artık yerleşmemi mi istiyorsun?','Aile ve liman hayatını öne çıkar.',[change('familyTies',5),change('safety',3),change('sailorNetwork',-1),flag('settled_family'),days(240)]),
    choice('keep-roaming','Denizi bırakmak neden bu kadar önemli?','Hareketli hayatını sürdür.',[change('sailorNetwork',3),change('familyTies',-2),days(240)]),
    { weight:7 }),
  C('med-debt-call','Hassan','Tüccar','Hassan: Eski borcun duruyor. Sana yeni bir iş verebilirim. Kazandığınla eskisini kapatırsın. Ama borç yeniden büyüyebilir.','TRADE',
    choice('pay-slowly','Biraz süre verir misin?','Borcu azalt ve riskten uzaklaş.',[change('debt',-5),change('money',-2),change('safety',2),days(180)]),
    choice('roll-debt','Yeni işin şartları ne?','Borcu büyütme ihtimaline rağmen çevrede kal.',[change('debt',4),change('merchantNetwork',3),change('money',4),days(180)]),
    { requires:{ merchant_debt:true }, weight:9 }),
  C('med-captivity','Anonim','Esirlikten dönen biri','Esirlikten dönen biri: Yıllarımı geri getiremiyorum. İnsan böyle bir şeyden sonra eski hayatına aynı gözle bakamıyor.','CAPTIVITY',
    choice('listen-only','Sadece dinlerim','Esaret deneyiminin sosyal ve ekonomik etkilerini anlamaya çalış.',[change('information',3),change('safety',2),days(70)]),
    choice('offer-help','Yardım teklif ederim','Onun yeniden çevre kurmasına destek ol.',[change('social',3),change('reputation',2),change('familyTies',1),days(70)]),
    { weight:6 }),
  C('med-captive-choice','Mühtedi Ahmed','Esaretten dönmüş denizci','Mühtedi Ahmed: Eski hayatımla bugün yaşadığım hayat aynı değil. Bunu anlamak için geçmişimi de bugünkü çevremi de bilmen gerekir.','IDENTITY',
    choice('respect-distance','Geçmişini anlatmak istemiyor musun?','Kişisel geçmişini sorgulamadan ilişki kur.',[change('social',3),change('information',2),days(100)]),
    choice('ask-about-worlds','Bu hayatı nasıl kurdun?','Farklı çevreler arasında nasıl yaşadığını anlamaya çalış.',[change('language',2),change('information',4),days(100)]),
    { weight:8 }),
  C('med-capture','Kaptan Selim','Kaptanın','Kaptan Selim: Çatışmadan sonra tayfanın bir kısmı esir düştü. Sen kurtuldun. Şimdi ne yapacaksın? Denize dönmek mi, karaya çıkmak mı?','CAPTIVITY',
    choice('return-ashore','Denize dönmemem mi gerekiyor?','Denizden uzaklaşıp hayatını yeniden kur.',[change('safety',5),change('sailorNetwork',-4),flag('survived_capture'),days(240)]),
    choice('stay-sea','Bunca şeyden sonra yine denize mi çıkayım?','Yaşananlardan sonra yine denize dön.',[change('safety',-3),change('sailorNetwork',4),flag('survived_capture'),days(240)]),
    { requires:{ sailor:true }, weight:11 }),
  C('med-ransom','Hassan','Tüccar','Hassan: Bir tanıdığımız esaretten döndü. Ailesinin hâlâ masrafları var. Sen de katkıda bulunacak mısın?','CAPTIVITY',
    choice('contribute','Benden ne kadar katkı bekliyorsun?','Maddi yük üstlenip topluluk bağını güçlendir.',[change('money',-3),change('social',4),change('reputation',2),days(120)]),
    choice('stay-out','Bu işe neden karışmam gerekiyor?','Kendi kaynaklarını koru.',[change('money',2),change('safety',1),days(120)]),
    { requires:{ survived_capture:true }, weight:8 }),
  C('med-new-identity','Ahmed','Yeni çevreden tanıdık','Ahmed: Eski hayatın hâlâ peşinde. Ama burada yeni bir çevren var. Hangisine ait olduğunu sen seçmelisin.','IDENTITY',
    choice('keep-past','Geçmişimi korurum','Aile ve eski çevre bağlarını sürdür.',[change('familyTies',4),change('social',2),days(180)]),
    choice('build-new','Yeni hayat kurarım','Yeni çevrenin dilini ve alışkanlıklarını öğren.',[change('language',4),change('social',3),change('familyTies',-3),flag('new_identity_network'),days(180)]),
    { requires:{ survived_capture:true }, weight:8 }),
  C('med-port-authority','Mehmet','Liman görevlisi','Mehmet: Adını kayıtlarda sık görmeye başladık. Bazıları sana güveniyor, bazıları ise fazla hareketli olduğunu düşünüyor. Limanda daha görünür olmak istediğine emin misin?','PORT',
    choice('reduce-visits','Geri çekilmemi mi istiyorsun?','Liman çevresinde daha temkinli davran.',[change('safety',4),change('portReputation',-2),days(150)]),
    choice('embrace-network','Bağlantılarımı kullanmamı mı bekliyorsunuz?','Liman ağındaki nüfuzunu artır.',[change('portReputation',5),change('social',2),change('safety',-2),days(150)]),
    { weight:9 }),
  C('med-language-gain','Giovanni','Eski denizci tanıdığın','Giovanni: Artık birkaç dili konuşabiliyorsun. Sana aracılık yapabileceğin yeni bir iş teklif ediliyor. Bunu ticaret için mi, bilgi için mi kullanacaksın?','IDENTITY',
    choice('use-for-trade','Bunu ticarette kullanmamı mı istiyorsun?','Dillerini ticari bağlantılara dönüştür.',[change('merchantNetwork',4),change('money',3),days(180)]),
    choice('use-for-information','Bu dilleri bilgi toplamak için mi kullanayım?','Farklı çevrelerden haber almayı kolaylaştır.',[change('intelligenceNetwork',4),change('information',3),days(180)]),
    { requires:{ language:true }, weight:8 }),
  C('med-informant-choice','Yusuf','Eski bağlantı','Yusuf: Küçük bir çevre kurabiliriz. İnsanlar gördüklerini bize aktaracak. Sen bu ağın içinde olmak istiyor musun?','INTELLIGENCE',
    choice('stay-independent','Bu ağın dışında kalmamı mı öneriyorsun?','Ağdan yararlan ama merkezine girme.',[change('information',3),change('safety',2),days(200)]),
    choice('join-network','Bu ağın içine girmemi mi istiyorsun?','Bilgi akışının daha derin bir parçası haline gel.',[change('intelligenceNetwork',6),change('reputation',2),change('safety',-3),flag('deep_intelligence'),days(200)]),
    { requires:{ intelligenceNetwork:true }, weight:11 }),
  C('med-network-test','Mehmet','Liman görevlisi','Mehmet: Senden küçük bir bilgi istiyorum. Kimin işine yarayacağını sorma. Bana verecek misin, vermeyecek misin?','INTELLIGENCE',
    choice('refuse-test','Benden bilgi çıkmaz','Bağlantının riskini azalt.',[change('safety',4),change('intelligenceNetwork',-1),days(120)]),
    choice('answer-test','Bildiğimi söylerim','Ağın içindeki güveni artır.',[change('intelligenceNetwork',5),change('safety',-3),days(120)]),
    { requires:{ deep_intelligence:true }, weight:10 }),
  C('med-counterattack','Mehmet','Liman görevlisi','Mehmet: Daha önce görüştüğün kişi hakkında yeniden sorularımız var. Bu kez sen de neden araştırdığımızı bilmek istiyorsun, değil mi?','INTELLIGENCE',
    choice('cooperate','Benden tam olarak ne istiyorsunuz?','Kendini açıkça ortaya koy.',[change('safety',2),change('intelligenceNetwork',-3),change('reputation',2),days(140)]),
    choice('withhold','Bunu neden size anlatayım?','Ağını koru ama riskini artır.',[change('intelligenceNetwork',4),change('safety',-5),days(140)]),
    { requires:{ deep_intelligence:true }, weight:11 }),
  C('med-retirement-trade','Hassan','Eski tüccar ortağın','Hassan: Artık her sefere çıkmak zorunda değilsin. Kıyıda düzenli bir ticaret kurabilirsin. Denizi bırakmaya hazır mısın?','TRADE',
    choice('retire-sea','Karaya geçerim','Ticaret ve aile bağlarına yönel.',[change('merchantNetwork',4),change('safety',4),change('sailorNetwork',-3),flag('shore_life'),days(300)]),
    choice('one-more-voyage','Bir sefer daha','Deniz çevreni bırakma.',[change('sailorNetwork',4),change('money',4),change('safety',-3),days(300)]),
    { requires:{ merchant_contact:true }, weight:8 }),
  C('med-old-friend','Meryem','Aileden biri','Meryem: Yıllar geçti. Evdekiler hâlâ aynı şeyi soruyor: Artık yerleşecek misin?','FAMILY',
    choice('return-home','Eve dönüyorum','Aile çevreni hayatının merkezine al.',[change('familyTies',6),change('safety',3),flag('family_center'),days(260)]),
    choice('continue-life','Yerleşmemi mi istiyorsun?','Hareketli hayatını sürdür.',[change('sailorNetwork',2),change('familyTies',-2),days(260)]),
    { weight:7 }),
  C('med-final-network','Yusuf','Eski bağlantı','Yusuf: Yıllar önce verdiğin küçük bir bilgi hâlâ konuşuluyor. Bu işin peşini bırakmak istiyorsan şimdi bırakabilirsin.','INTELLIGENCE',
    choice('walk-away','Bu işten şimdi çekilebilir miyim?','Geçmiş bağlantılarını kapatmaya çalış.',[change('safety',5),change('intelligenceNetwork',-4),days(300)]),
    choice('stay-connected','Bu bağlantıyı neden bırakayım?','Eski ağın içinde kal.',[change('intelligenceNetwork',5),change('reputation',2),change('safety',-3),days(300)]),
    { requires:{ intelligenceNetwork:true }, minDate:'1580-01-01', weight:10 }),
  C('med-final-port','Salih','Liman kahvesindeki tanıdık','Salih: Bu liman değişti. Gençliğinde tanıdığın insanların çoğu artık burada değil. Sen geriye ne bırakmak istiyorsun?','PORT',
    choice('teach-young','Benden öğrendiklerini onlara anlatmamı mı istiyorsun?','Deneyimini yeni kuşağa bırak.',[change('social',5),change('reputation',3),flag('mentor'),days(260)]),
    choice('quiet-retirement','Artık kenara çekilmemi mi istiyorsun?','Daha sakin bir hayat seç.',[change('safety',5),change('social',-2),days(260)]),
    { weight:8 }),
  C('med-final-family','Meryem','Aileden biri','Meryem: Hayatının bu döneminde geriye baktığında yanında hangi bağın kalmasını istiyorsun? Ailen mi, deniz mi, başka bir çevre mi?','FAMILY',
    choice('family-first','Ailemle mi kalayım?','Aile bağlarını son kez güçlendir.',[change('familyTies',7),change('social',3),days(240)]),
    choice('world-first','Denize dönmemi mi öneriyorsun?','Hayatını şekillendiren hareketli çevreyi koru.',[change('sailorNetwork',3),change('merchantNetwork',2),days(240)]),
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
    .map((item) => ALL_MEDITERRANEAN_CARDS.find((cardItem) => cardItem.id === item.eventId))
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
  C('med-fallback-port','Liman sakini','Tanıdık','Liman sakini: Bugün liman sakin. Çalışacak mısın, yoksa biraz etrafı mı gözleyeceksin?','PORT',
    choice('watch','Önce ne olduğunu anlat.','Çevreyi ve insanları gözlemle.',[change('information',2),days(90)]),
    choice('work','Bugün ne kadar kazanacağım?','Günlük kazancını artır.',[change('money',2),change('portReputation',1),days(90)])),
  C('med-fallback-family','Meryem','Aileden biri','Meryem: Bugün evde sakin bir gün. İşe dönmek mi istiyorsun, yoksa biraz daha bizimle kalacak mısın?','FAMILY',
    choice('stay','Biraz daha kalmamı mı istiyorsunuz?','Aile bağını güçlendir.',[change('familyTies',3),change('social',2),days(100)]),
    choice('leave','Şimdi işe dönmem gerekiyor mu?','Kendi hayatının peşinden git.',[change('money',2),change('familyTies',-1),days(100)])),
];

const ALL_MEDITERRANEAN_CARDS = [...HISTORICAL_MEDITERRANEAN_CARDS, ...MEDITERRANEAN_CARDS, ...EXPANDED_MEDITERRANEAN_CARDS, ...REIGNS_SCALE_CARDS];

export const MEDITERRANEAN_CARD_COUNT = ALL_MEDITERRANEAN_CARDS.length;

function getLinkedCardId(current: MediterraneanCardDefinition, optionId: string): string | null {
  const left = optionId.endsWith(current.left.idSuffix);
  const right = optionId.endsWith(current.right.idSuffix);
  if (!left && !right) return null;

  const arc = current.id.match(/^med-arc-(\\d+)-(\\d+)$/);
  if (arc) {
    const scene = Number(arc[1]);
    const place = Number(arc[2]);
    return left
      ? place < 10 ? `med-arc-${scene}-${place + 1}` : `med-arc-${Math.min(scene + 1, 18)}-1`
      : scene < 18 ? `med-arc-${scene + 1}-${place}` : `med-arc-1-${place}`;
  }

  const scale = current.id.match(/^med-reigns-([^-]+)-(\\d+)$/);
  if (scale) {
    const scene = scale[1];
    const place = Number(scale[2]);
    if (left) {
      return place < 25 ? `med-reigns-${scene}-${place + 1}` : null;
    }

    // Right swipe moves the story to the next scene while keeping the
    // geographical position. The scene order is taken from the generated
    // deck itself, so new scenes automatically participate in the chain.
    const prefixes = Array.from(
      new Set(
        ALL_MEDITERRANEAN_CARDS
          .map((item) => item.id.match(/^med-reigns-([^-]+)-\\d+$/)?.[1])
          .filter((value): value is string => Boolean(value)),
      ),
    );
    const index = prefixes.indexOf(scene);
    const nextScene = prefixes[index + 1];
    return nextScene ? `med-reigns-${nextScene}-${place}` : null;
  }

  const historical: Record<string, { left?: string; right?: string }> = {
    "med-history-port": { left: "med-history-network", right: "med-history-network" },
    "med-history-sailor": { left: "med-history-network", right: "med-history-network" },
    "med-history-trader": { left: "med-history-merchant-report", right: "med-history-network" },
    "med-history-interpreter": { left: "med-history-network", right: "med-history-muhtedi" },
    "med-history-network": { left: "med-history-merchant-source", right: "med-history-intermediary" },
    "med-history-merchant-report": { left: "med-history-diplomacy", right: "med-history-ragusa" },
    "med-history-letter": { left: "med-history-diplomatic-letter", right: "med-history-counter" },
    "med-history-captive": { left: "med-history-captive-source", right: "med-history-counter" },
    "med-history-muhtedi": { left: "med-history-intermediary", right: "med-history-counter" },
    "med-history-counter": { left: "med-history-questioning", right: "med-history-counter-check" },
    "med-history-disinformation": { left: "med-history-questioning", right: "med-history-ragusa" },
    "med-history-ragusa": { left: "med-history-diplomacy", right: "med-history-habsburg" },
    "med-history-habsburg": { left: "med-history-menzil", right: "med-history-cerbe" },
    "med-history-merchant-source": { left: "med-history-ragusa", right: "med-history-questioning" },
    "med-history-intermediary": { left: "med-history-diplomacy", right: "med-history-counter" },
    "med-history-captive-source": { left: "med-history-muhtedi", right: "med-history-counter" },
    "med-history-diplomacy": { left: "med-history-menzil", right: "med-history-ragusa" },
    "med-history-menzil": { left: "med-history-status", right: "med-history-decision" },
    "med-history-status": { left: "med-history-cerbe", right: "med-history-decision" },
    "med-history-diplomatic-letter": { left: "med-history-questioning", right: "med-history-counter-check" },
    "med-history-questioning": { left: "med-history-counter-check", right: "med-history-decision" },
    "med-history-counter-check": { left: "med-history-decision", right: "med-history-decision" },
    "med-history-decision": { left: "med-history-cerbe", right: "med-history-cerbe" },
    "med-history-cerbe": { left: "med-history-after-cerbe", right: "med-history-after-cerbe" },
    "med-history-after-cerbe": { left: "med-history-malta", right: "med-history-malta" },
    "med-history-malta": { left: "med-history-inquiry", right: "med-history-inquiry" },
    "med-history-inquiry": { left: "med-history-lepanto", right: "med-history-lepanto" },
    "med-history-lepanto": { left: "med-history-final-network", right: "med-history-final-network" },
    "med-history-final-network": { left: "med-history-final-port", right: "med-history-final-port" },
    "med-history-final-port": { left: "med-history-final-family", right: "med-history-final-family" },
    "med-history-final-family": { left: "med-port-authority", right: "med-final-family" },
  };

  const authored: Record<string, { left?: string; right?: string }> = {
    "med-port-first-work": { left: "med-port-rumor", right: "med-port-sailor" },
    "med-port-rumor": { left: "med-merchant-contact", right: "med-strange-question" },
    "med-merchant-contact": { left: "med-trader-credit", right: "med-hidden-letter" },
    "med-strange-question": { left: "med-hidden-letter", right: "med-port-authority" },
    "med-hidden-letter": { left: "med-contact-reward", right: "med-counter-watch" },
    "med-contact-reward": { left: "med-trader-credit", right: "med-information-trader" },
    "med-trader-credit": { left: "med-debt-call", right: "med-information-trader" },
    "med-debt-call": { left: "med-retirement-trade", right: "med-information-trader" },
    "med-information-trader": { left: "med-coded-note", right: "med-port-authority" },
    "med-coded-note": { left: "med-counterintelligence", right: "med-informant-choice" },
    "med-counter-watch": { left: "med-counterintelligence", right: "med-counterattack" },
    "med-counterintelligence": { left: "med-informant-choice", right: "med-network-test" },
    "med-informant-choice": { left: "med-network-test", right: "med-final-network" },
    "med-network-test": { left: "med-counterattack", right: "med-final-network" },
    "med-counterattack": { left: "med-final-network", right: "med-final-port" },
    "med-final-network": { left: "med-final-port", right: "med-final-family" },
    "med-final-port": { left: "med-final-family", right: "med-final-family" },

    "med-family-letter": { left: "med-family-absence", right: "med-family-marriage" },
    "med-family-absence": { left: "med-family-marriage", right: "med-old-friend" },
    "med-family-marriage": { left: "med-old-friend", right: "med-final-family" },
    "med-old-friend": { left: "med-final-family", right: "med-final-port" },

    "med-port-sailor": { left: "med-ship-discipline", right: "med-ship-supplies" },
    "med-ship-discipline": { left: "med-ship-supplies", right: "med-ship-illness" },
    "med-ship-supplies": { left: "med-ship-illness", right: "med-corsair-offer" },
    "med-ship-illness": { left: "med-corsair-offer", right: "med-capture" },
    "med-corsair-offer": { left: "med-captain-trust", right: "med-capture" },
    "med-captain-trust": { left: "med-capture", right: "med-family-absence" },
    "med-capture": { left: "med-ransom", right: "med-new-identity" },
    "med-ransom": { left: "med-new-identity", right: "med-language-gain" },
    "med-new-identity": { left: "med-language-gain", right: "med-old-friend" },
    "med-language-gain": { left: "med-retirement-trade", right: "med-informant-choice" },
    "med-retirement-trade": { left: "med-old-friend", right: "med-final-port" },
  };
  const historicalBranch = historical[current.id];
  if (historicalBranch) return historicalBranch[left ? 'left' : right ? 'right' : 'left'] ?? null;

  const branch = authored[current.id];
  return branch?.[left ? 'left' : right ? 'right' : 'left'] ?? null;
}

export function getActiveOttomanMediterraneanCard(snapshot: GameSessionSnapshot): ActiveMediterraneanCard {
  const decided = new Set(snapshot.decisionHistory.map((item) => item.eventId));

  if (snapshot.decisionHistory.length === 0) {
    const starts: Record<string, string> = {
      'med-port-worker': 'med-history-port',
      'med-sailor': 'med-history-sailor',
      'med-trader': 'med-history-trader',
      'med-interpreter': 'med-history-interpreter',
    };
    const startId = starts[snapshot.state.selection.roleId] ?? 'med-port-first-work';
    const start = ALL_MEDITERRANEAN_CARDS.find((item) => item.id === startId);
    if (start && matches(start, snapshot)) {
      return { card: start, event: toEvent(start, snapshot) };
    }
  }

  const previous = snapshot.decisionHistory
    .slice()
    .sort((a, b) => b.sequence - a.sequence)[0];
  const previousCard = previous
    ? ALL_MEDITERRANEAN_CARDS.find((item) => item.id === previous.eventId)
    : undefined;

  if (previous && previousCard) {
    const linkedId = getLinkedCardId(previousCard, previous.optionId);
    const linked = linkedId
      ? ALL_MEDITERRANEAN_CARDS.find(
          (item) => item.id === linkedId && !decided.has(item.id) && matches(item, snapshot),
        )
      : undefined;
    if (linked) return { card: linked, event: toEvent(linked, snapshot) };
  }

  const eligible = ALL_MEDITERRANEAN_CARDS
    .filter((card) => !decided.has(card.id))
    .filter((card) => matches(card, snapshot))
    .sort((a, b) => score(a, snapshot) - score(b, snapshot));

  const card = eligible[0] ?? FALLBACKS[snapshot.decisionHistory.length % FALLBACKS.length];
  return { card, event: toEvent(card, snapshot) };
}
