import type { GameSessionSnapshot } from './types';

export type CampaignEndingKind =
  | 'LEADERSHIP_LOST'
  | 'MOVEMENT_COLLAPSED'
  | 'POLITICAL_MARGINALIZATION'
  | 'POWER_NOT_REACHED'
  | 'GOVERNMENT_LOST'
  | 'DIPLOMATIC_ISOLATION'
  | 'STATE_COLLAPSE'
  | 'POPULAR_ASCENDANCY'
  | 'INSTITUTIONAL_NETWORK'
  | 'ISOLATED_POWER'
  | 'BALANCED_SURVIVAL'
  | 'HISTORICAL_TERMINUS'
  | 'ALTERNATE_TERMINUS'
  | 'LIFE_FINANCIAL_CRISIS'
  | 'LIFE_OVEREXPOSED'
  | 'LIFE_ISOLATED'
  | 'LIFE_REPUTATION_CRISIS'
  | 'LIFE_REBUILD'
  | 'LIFE_NEW_START'
  | 'LIFE_COMMUNITY'
  | 'LIFE_PUBLIC_FIGURE'
  | 'LIFE_QUIET_END'
  | 'MEDITERRANEAN_SHORE_LIFE'
  | 'MEDITERRANEAN_SEAFARER'
  | 'MEDITERRANEAN_NETWORK'
  | 'MEDITERRANEAN_TRADER'
  | 'MEDITERRANEAN_REBUILT'
  | 'MEDITERRANEAN_QUIET_END';

export interface CampaignProfile {
  playerName: string;
  campaignId: 'germany-1921' | 'germany-life' | 'ottoman-mediterranean';
  startedAt: string;
  leadershipActive: boolean;
  endingId?: CampaignEndingKind;
}

export interface CampaignEnding {
  id: CampaignEndingKind;
  title: string;
  subtitle: string;
  description: string;
  classification: 'COUNTERFACTUAL_SIMULATION' | 'HISTORICAL_FACT';
  imageKey?: string | null;
  pathLabel?: string;
  pathTraits?: string[];
}

function value(snapshot: GameSessionSnapshot, key: string): number {
  return snapshot.state.variables[key] ?? 50;
}

function ending(
  id: CampaignEndingKind,
  title: string,
  subtitle: string,
  description: string,
  classification: CampaignEnding['classification'] = 'COUNTERFACTUAL_SIMULATION',
  pathLabel?: string,
  pathTraits?: string[],
): CampaignEnding {
  return {
    id,
    title,
    subtitle,
    description,
    classification,
    imageKey: null,
    pathLabel,
    pathTraits,
  };
}

function selectedSuffixes(snapshot: GameSessionSnapshot): string[] {
  return snapshot.decisionHistory.map((record) => {
    const prefix = `${record.eventId}:`;
    return record.optionId.startsWith(prefix)
      ? record.optionId.slice(prefix.length)
      : record.optionId;
  });
}

function countSelected(selected: string[], options: readonly string[]): number {
  const optionSet = new Set(options);
  return selected.reduce((count, item) => count + (optionSet.has(item) ? 1 : 0), 0);
}

const CONSENSUS_CHOICES = [
  'look-for-steady-work',
  'keep-speech-short',
  'share-organizer-power',
  'ask-no-strings-support',
  'promise-shared-leadership',
  'observe-group',
  'measured-speech',
  'broaden-program',
  'editorial-distance',
  'negotiate-leadership',
  'shared-authority',
  'institutional-review',
  'document-authority',
  'request-legal-review',
  'parliamentary-analysis',
] as const;

const CENTRALIZATION_CHOICES = [
  'accept-mayr-work',
  'stay-political',
  'attend-evening-circle',
  'keep-political-time',
  'take-the-floor',
  'become-organizer',
  'defend-organizer-role',
  'refuse-preconditions',
  'engage-group',
  'seek-active-role',
  'confrontational-speech',
  'central-party-paper',
  'challenge-leadership',
  'demand-chairmanship',
  'expedite-emergency-file',
  'prepare-government-agenda',
] as const;

const PUBLIC_PROFILE_CHOICES = [
  'take-the-floor',
  'speak-on-record',
  'remain-speaker',
  'engage-group',
  'seek-active-role',
  'measured-speech',
  'broaden-program',
  'parliamentary-analysis',
] as const;

const INSTITUTIONAL_RESTRAINT_CHOICES = [
  'reject-conditional-donation',
  'promise-shared-leadership',
  'negotiate-leadership',
  'shared-authority',
  'institutional-review',
  'document-authority',
  'request-legal-review',
  'parliamentary-analysis',
  'challenge-discriminatory-policy',
  'seek-limita',
] as const;

function evaluateGermanyLifeEnding(
  snapshot: GameSessionSnapshot,
): CampaignEnding | null {
  const money = value(snapshot, 'money');
  const safety = value(snapshot, 'safety');
  const social = value(snapshot, 'social');
  const reputation = value(snapshot, 'reputation');
  const decisions = snapshot.decisionHistory.length;
  const date = snapshot.state.currentDate;
  const flags = snapshot.state.flags;

  if (decisions >= 4) {
    if (money <= 2) {
      return ending(
        'LIFE_FINANCIAL_CRISIS',
        'Geçim Çıkmazı',
        'Maddi dengeyi artık sürdüremiyorsun.',
        'Uzun süre boyunca gelir ve harcamalar arasındaki denge bozuldu. Kurduğun günlük düzen dağıldı ve bu hayat çizgisi burada sona erdi.',
        'COUNTERFACTUAL_SIMULATION',
        'Geçim baskısı',
        ['Para', 'Gündelik hayat', 'Kırılganlık'],
      );
    }

    if (safety <= 2) {
      return ending(
        'LIFE_OVEREXPOSED',
        'Fazla Açıkta',
        'Kendini koruyacak hareket alanın kalmadı.',
        'Kararların seni giderek daha görünür ve kırılgan bir konuma taşıdı. Çevrendeki koşullar içinde bu hayatı aynı biçimde sürdürmek artık mümkün değildi.',
        'COUNTERFACTUAL_SIMULATION',
        'Riskli yaşam yolu',
        ['Güvenlik', 'Görünürlük', 'Baskı'],
      );
    }

    if (social <= 2) {
      return ending(
        'LIFE_ISOLATED',
        'Yalnızlaşan Hayat',
        'Bağlantıların birer birer koptu.',
        'İş, taşınma ve kişisel tercihler zamanla çevrendeki insanları uzaklaştırdı. Hayatın devam etti, fakat seni taşıyan sosyal ağ kalmadı.',
        'COUNTERFACTUAL_SIMULATION',
        'Yalnızlık yolu',
        ['Çevre', 'Mesafe', 'Kopuş'],
      );
    }

    if (reputation <= 2) {
      return ending(
        'LIFE_REPUTATION_CRISIS',
        'İtibar Kaybı',
        'Çevrendeki güven büyük ölçüde kayboldu.',
        'Verdiğin kararlar sonunda insanlar sana daha az güvenmeye başladı. İş ve sosyal hayat aynı anda daralınca mevcut yaşam çizgin sürdürülemez hâle geldi.',
        'COUNTERFACTUAL_SIMULATION',
        'İtibar krizi',
        ['İtibar', 'Güven', 'Çevre'],
      );
    }

    if (reputation >= 98 || social >= 98 || money >= 98 || safety >= 98) {
      return ending(
        'LIFE_OVEREXPOSED',
        'Denge Bozuldu',
        'Bir alan hayatının geri kalanını gölgede bıraktı.',
        'Tek bir alanda aşırı güçlenmek kısa vadede avantaj sağladı; fakat hayatının geri kalanındaki dengeyi bozdu. Bu koşu, o aşırılığın sonuçlarıyla sona erdi.',
        'COUNTERFACTUAL_SIMULATION',
        'Aşırı uç',
        ['Dengesizlik', 'Baskı', 'Tek yönlü yaşam'],
      );
    }
  }

  const madeFinalChoice = Boolean(flags.rebuild_here || flags.start_elsewhere);
  if (!madeFinalChoice && date < '1945-09-01') return null;

  if (flags.start_elsewhere) {
    return ending(
      'LIFE_NEW_START',
      'Yeni Bir Başlangıç',
      'Eski hayatını geride bırakmayı seçtin.',
      'Yıllar boyunca kurduğun bağların bir kısmını geride bırakıp başka bir yerde yeniden başlamaya karar verdin. Yeni hayatın daha belirsizdi, ama geçmiş koşunun yükünü taşımak zorunda değildin.',
      'COUNTERFACTUAL_SIMULATION',
      'Yeni başlangıç yolu',
      ['Değişim', 'Belirsizlik', 'Yeni çevre'],
    );
  }

  if (flags.rebuild_here) {
    return ending(
      'LIFE_REBUILD',
      'Aynı Yerde Yeniden',
      'Kalmak ve yeniden kurmak senin seçimin oldu.',
      'Eski düzen sona ererken bulunduğun yerde kalmayı seçtin. Kaybettiklerini tamamen geri getiremedin; ama çevrendeki insanlarla yeni bir gündelik hayat kurmaya başladın.',
      'COUNTERFACTUAL_SIMULATION',
      'Yeniden kurma yolu',
      ['Süreklilik', 'Çevre', 'Yeni düzen'],
    );
  }

  if (flags.family_together || social >= 70) {
    return ending(
      'LIFE_COMMUNITY',
      'Birlikte Kalanlar',
      'Hayatta en çok insan ilişkilerine yatırım yaptın.',
      'İş ve para zaman zaman değişti; buna rağmen çevrendeki insanlarla kurduğun bağlar koşunun sonunda en güçlü dayanağın oldu. Hikâyen büyük bir makamla değil, birlikte kalmayı başardığın insanlarla tamamlandı.',
      'COUNTERFACTUAL_SIMULATION',
      'Bağlar yolu',
      ['Aile', 'Dostluk', 'Çevre'],
    );
  }

  if (flags.public_profile || flags.known_locally || reputation >= 70) {
    return ending(
      'LIFE_PUBLIC_FIGURE',
      'Herkes Seni Tanıyor',
      'Görünürlük hayatının ana ekseni hâline geldi.',
      'Basın, iş ve sosyal çevre kararların seni giderek daha tanınır biri yaptı. Bu görünürlük sana kapılar açtı; aynı zamanda özel hayatını daralttı.',
      'COUNTERFACTUAL_SIMULATION',
      'Görünürlük yolu',
      ['İtibar', 'Tanınırlık', 'Kamusal hayat'],
    );
  }

  return ending(
    'LIFE_QUIET_END',
    'Sessiz Bir Hayat',
    'Büyük sıçramalar yerine dengede kalmayı başardın.',
    'Yıllar boyunca iş, para, çevre ve güvenlik arasında sürekli küçük seçimler yaptın. Koşunun sonunda büyük bir servet ya da ün değil, sürdürülebilir bir hayat bıraktın.',
    'COUNTERFACTUAL_SIMULATION',
    'Dengeli yaşam yolu',
    ['Denge', 'Gündelik hayat', 'Süreklilik'],
  );
}


function evaluateOttomanMediterraneanEnding(
  snapshot: GameSessionSnapshot,
): CampaignEnding | null {
  const decisions = snapshot.decisionHistory.length;
  const flags = snapshot.state.flags;
  // The Mediterranean campaign now has an explicit historical epilogue.
  // Do not end the run merely because many cards were played: the player
  // should be able to move through the late-sixteenth-century chronology.
  if (!flags.mediterranean_ended && decisions < 80 && snapshot.state.currentDate < '1600-01-01') {
    return null;
  }

  const v = (key: string) => snapshot.state.variables[key] ?? 0;
  const intelligence = v('intelligenceNetwork');
  const sailor = v('sailorNetwork');
  const merchant = v('merchantNetwork');
  const family = v('familyTies');
  const reputation = v('reputation');
  const safety = v('safety');

  if (flags.med_path_family || family >= 70 || flags.family_center || flags.settled_family) {
    return ending(
      'MEDITERRANEAN_REBUILT',
      'Eve Dönen',
      'Hareketli yılların ardından daha kalıcı bir hayat kurdun.',
      'Yıllar boyunca limanlar, denizler ve farklı çevreler arasında yaşadın. Son dönemde aile bağlarını yeniden merkeze alarak daha yerleşik bir hayat kurdun.',
      'COUNTERFACTUAL_SIMULATION',
      'Aile ve yeniden kurma yolu',
      ['Aile', 'Güvenlik', 'Süreklilik'],
    );
  }

  if (flags.med_path_trade && merchant >= 10) {
    return ending(
      'MEDITERRANEAN_TRADER',
      'Kıyıda Bir Hayat',
      'Liman bağlantılarını kalıcı bir ticaret düzenine çevirdin.',
      'Yıllar içinde tanıdığın tüccarlar ve limanlar sayesinde deniz çevresindeki ilişkilerini daha düzenli bir geçime dönüştürdün.',
      'COUNTERFACTUAL_SIMULATION',
      'Ticaret yolu',
      ['Ticaret', 'Liman', 'Süreklilik'],
    );
  }

  if (flags.med_path_sea || (sailor >= 12 && !flags.settled_family)) {
    return ending(
      'MEDITERRANEAN_SEAFARER',
      'Denizden Ayrılmayan',
      'Hayatının büyük kısmı deniz çevresinde geçti.',
      'Tayfa, kaptanlar ve limanlar arasındaki ilişkiler hayatının ana eksenini oluşturdu. Yıllar geçse de deniz çevresini bırakmadın.',
      'COUNTERFACTUAL_SIMULATION',
      'Deniz yolu',
      ['Denizcilik', 'Tayfa', 'Hareket'],
    );
  }

  if (flags.med_path_network || (flags.deep_intelligence && intelligence >= 15)) {
    return ending(
      'MEDITERRANEAN_NETWORK',
      'Ağın İçinde',
      'Hayatın bilgi, bağlantılar ve güven üzerine kuruldu.',
      'Farklı limanlardan gelen insanlarla kurduğun ilişkiler yıllar boyunca sürdü. Büyük olayların merkezinde olmaktan çok, bilgi akışlarının arasında kendi yerini buldun.',
      'COUNTERFACTUAL_SIMULATION',
      'Bilgi ve ağ yolu',
      ['İstihbarat', 'Bağlantılar', 'Gizlilik'],
    );
  }

  if (flags.med_path_quiet) {
    return ending(
      'MEDITERRANEAN_QUIET_END',
      'Sessiz Bir Son',
      'Büyük sıçramalar yerine dengeli bir hayat seçtin.',
      'Deniz, ticaret, aile ve bilgi çevrelerinin içinden geçerek sonunda daha sakin bir hayatı tercih ettin. Geride tek bir kimliğe sığmayan bir yaşam bıraktın.',
      'COUNTERFACTUAL_SIMULATION',
      'Dengeli hayat yolu',
      ['Denge', 'Aile', 'Liman'],
    );
  }

  if (flags.deep_intelligence && intelligence >= 15) {
    return ending(
      'MEDITERRANEAN_NETWORK',
      'Ağın İçinde',
      'Hayatın bilgi, bağlantılar ve güven üzerine kuruldu.',
      'Limanlar ve farklı çevreler arasında kurduğun bağlantılar hayatının belirleyici unsuru oldu. Büyük olayların merkezinde olmak yerine bilgi akışlarının arasında yaşayan bir hayat kurdun.',
      'COUNTERFACTUAL_SIMULATION',
      'Bilgi ve ağ yolu',
      ['İstihbarat', 'Bağlantılar', 'Gizlilik'],
    );
  }

  if (flags.shore_life && merchant >= 10) {
    return ending(
      'MEDITERRANEAN_TRADER',
      'Kıyıda Bir Hayat',
      'Denizden karaya uzanan ticari bir düzen kurdun.',
      'Yıllar içinde liman bağlantılarını ticarete çevirdin ve sürekli denize çıkmak yerine kıyıda daha düzenli bir hayat kurdun.',
      'COUNTERFACTUAL_SIMULATION',
      'Ticaret yolu',
      ['Ticaret', 'Liman', 'Süreklilik'],
    );
  }

  if (sailor >= 12 && !flags.settled_family) {
    return ending(
      'MEDITERRANEAN_SEAFARER',
      'Denizden Ayrılmayan',
      'Hayatının büyük kısmı deniz çevresinde geçti.',
      'Tayfa, kaptanlar ve limanlar arasındaki ilişkiler hayatının ana eksenini oluşturdu. Karadaki bağların değişse de deniz çevresini bırakmadın.',
      'COUNTERFACTUAL_SIMULATION',
      'Deniz yolu',
      ['Denizcilik', 'Tayfa', 'Hareket'],
    );
  }

  if (family >= 70 || flags.family_center || flags.settled_family) {
    return ending(
      'MEDITERRANEAN_REBUILT',
      'Eve Dönen',
      'Hareketli yılların ardından daha kalıcı bir hayat kurdun.',
      'Deniz ve liman dünyasının sunduğu farklı yolların ardından aile bağlarını yeniden merkezine aldın. Hayatının son dönemini daha istikrarlı bir çevrede geçirdin.',
      'COUNTERFACTUAL_SIMULATION',
      'Aile ve yeniden kurma yolu',
      ['Aile', 'Güvenlik', 'Yeni düzen'],
    );
  }

  if (reputation >= 70 || safety >= 75) {
    return ending(
      'MEDITERRANEAN_SHORE_LIFE',
      'Limanın Tanıdığı Biri',
      'Uzun yıllar boyunca çevrende tanınan ve güvenilen biri oldun.',
      'Büyük bir makam ya da servetten çok, liman çevresindeki ilişkilerin ve yıllar içinde oluşan itibarın sana kalıcı bir yer sağladı.',
      'COUNTERFACTUAL_SIMULATION',
      'Liman yolu',
      ['İtibar', 'Çevre', 'Süreklilik'],
    );
  }

  return ending(
    'MEDITERRANEAN_QUIET_END',
    'Sessiz Bir Son',
    'Hayatın tek bir çevreye sığmadı.',
    'Ticaret, deniz, aile ve bilgi ağları arasında farklı dönemlerden geçtin. Sonunda tek bir kimliğe indirgenemeyen, kendi seçimlerinin şekillendirdiği bir hayat bıraktın.',
    'COUNTERFACTUAL_SIMULATION',
    'Dengeli hayat yolu',
    ['Deniz', 'Liman', 'Aile', 'Bilgi'],
  );
}

export function evaluateCampaignEnding(
  snapshot: GameSessionSnapshot,
): CampaignEnding | null {
  if (snapshot.campaign?.campaignId === 'ottoman-mediterranean') {
    return evaluateOttomanMediterraneanEnding(snapshot);
  }
  return evaluateGermanyCampaignEnding(snapshot);
}

export function evaluateGermanyCampaignEnding(
  snapshot: GameSessionSnapshot,
): CampaignEnding | null {
  if (snapshot.campaign?.campaignId === 'germany-life') {
    return evaluateGermanyLifeEnding(snapshot);
  }

  const publicSupport = value(snapshot, 'publicSupport');
  const institutionalInfluence = value(snapshot, 'institutionalInfluence');
  const stability = value(snapshot, 'stability');
  const foreignRelations = value(snapshot, 'foreignRelations');
  const decisions = snapshot.decisionHistory.length;
  const date = snapshot.state.currentDate;
  const selected = selectedSuffixes(snapshot);
  const consensusScore = countSelected(selected, CONSENSUS_CHOICES);
  const centralizationScore = countSelected(selected, CENTRALIZATION_CHOICES);
  const publicProfileScore = countSelected(selected, PUBLIC_PROFILE_CHOICES);
  const restraintScore = countSelected(selected, INSTITUTIONAL_RESTRAINT_CHOICES);

  const meters = [publicSupport, institutionalInfluence, stability, foreignRelations];
  const criticalLow = meters.filter((meter) => meter <= 3).length;
  const criticalHigh = meters.filter((meter) => meter >= 97).length;

  if (decisions >= 4 && (criticalLow >= 1 || criticalHigh >= 1)) {
    const high = criticalHigh > 0;
    return high
      ? ending(
          'STATE_COLLAPSE',
          'Denge kontrolden çıktı',
          'Bir güç alanı diğerlerinin önüne geçti.',
          'Kararların kısa vadede büyük bir etki yarattı; fakat güç tek bir alanda aşırı yoğunlaşınca kurduğun düzen kendi ağırlığını taşıyamadı. Son hamlelerin seni güçlendirmek yerine sistemin dengesini bozdu.',
        )
      : ending(
          'POLITICAL_MARGINALIZATION',
          'Siyasi dayanak çöktü',
          'Etrafındaki destek halkası dağıldı.',
          'Kritik bir güç alanını kaybettin. Bir zamanlar işe yarayan bağlantılar, ittifaklar ve kamu desteği giderek etkisizleşti. Kampanyan büyük bir kırılmayla değil, çevrenin yavaş yavaş boşalmasıyla sona erdi.',
        );
  }

  if (publicSupport <= 5 && institutionalInfluence <= 10) {
    return ending(
      'MOVEMENT_COLLAPSED',
      'Siyasi hareket dağıldı',
      'Ne kamuoyu ne de kurumlar arkanda kaldı.',
      'Kamu desteği ile örgütsel etki aynı anda çöktü. Toplantılar küçüldü, bağlantılar koptu ve kararlarını uygulayacak bir yapı kalmadı. Başlattığın hareket, kalıcı bir siyasi güce dönüşemeden dağıldı.',
    );
  }

  if (institutionalInfluence <= 5 && decisions >= 8) {
    return ending(
      'LEADERSHIP_LOST',
      'Liderlik sona erdi',
      'Karar verme gücün elinden kaydı.',
      'Kampanya devam ederken çevrendeki aktörler güç kazandı, sen ise kurum içindeki etkinliğini kaybettin. Adın hâlâ biliniyordu; ancak oyunun son bölümünde kararları artık başkaları belirliyordu.',
    );
  }

  if (foreignRelations <= 5 && stability <= 10 && date >= '1933-01-01') {
    return ending(
      'DIPLOMATIC_ISOLATION',
      'Uluslararası ve iç kriz',
      'İçeride kırılganlık, dışarıda yalnızlık.',
      'İç istikrarı koruyamazken dış ilişkiler de çözüldü. Bir alandaki krizi diğerindeki güçle telafi etme şansın kalmadı. Kampanyan iki cephede birden sıkışarak sona erdi.',
    );
  }

  if (stability <= 5 && date >= '1933-01-01') {
    return ending(
      'GOVERNMENT_LOST',
      'Yönetim sürdürülemedi',
      'Düzen, kararlarının hızına yetişemedi.',
      'Siyasi çizgin bir süre etkili oldu; ancak iç istikrar kritik seviyenin altına düştüğünde karar mekanizması işlemez hâle geldi. Kurduğun yapı ayakta kalsa bile onu yönetecek düzen kalmadı.',
    );
  }

  if (date >= '1945-05-08') {
    if (restraintScore >= 5 && consensusScore >= 4) {
      return ending(
        'BALANCED_SURVIVAL',
        'Kurumsal Fren',
        'Gücün büyürken sınır koymayı seçtin.',
        'Kampanya boyunca her hızlı kararın karşısına bir kayıt, inceleme veya yetki sınırı koydun. Bu çizgi seni en güçlü aktör yapmadı; fakat karar mekanizmasında fren görevi gören kalıcı bir ağırlık yarattı.',
        'COUNTERFACTUAL_SIMULATION',
        'Kurumsal denetim yolu',
        ['Denetim', 'Uzlaşma', 'Sınırlı güç'],
      );
    }

    if (centralizationScore >= 7 && centralizationScore >= consensusScore + 3) {
      return ending(
        'INSTITUTIONAL_NETWORK',
        'Tek Merkez',
        'Yetkiyi paylaşmak yerine toplamayı seçtin.',
        'Erken dönemde küçük görevlerle başlayan süreç, karar yetkisinin giderek daha dar bir çevrede toplanmasına dönüştü. Kampanyanın sonunda etkiliydin; ancak kurduğun yapı kişisel ve kurumsal merkezileşmeye bağımlı hâle geldi.',
        'COUNTERFACTUAL_SIMULATION',
        'Merkezileşme yolu',
        ['Merkezî güç', 'Kurum etkisi', 'Düşük paylaşım'],
      );
    }

    if (consensusScore >= 7 && consensusScore >= centralizationScore + 2) {
      return ending(
        'ALTERNATE_TERMINUS',
        'Paylaşılan Yetki',
        'Krizleri güç paylaşımıyla aşmayı tercih ettin.',
        'Kampanya boyunca liderlik mücadelelerinde geri çekilmek yerine müzakere ettin, görevleri paylaştın ve kurumların hareket alanını korudun. Sonuç daha yavaş ilerleyen ama tek kişiye daha az bağımlı bir siyasi yapı oldu.',
        'COUNTERFACTUAL_SIMULATION',
        'Uzlaşma yolu',
        ['Yetki paylaşımı', 'İstikrar', 'Müzakere'],
      );
    }

    if (publicProfileScore >= 6 && publicSupport >= 60) {
      return ending(
        'POPULAR_ASCENDANCY',
        'Kamuoyu Siyaseti',
        'Kapalı odalardan çok görünürlüğe yatırım yaptın.',
        'Konuşmalar, basın temasları ve açık siyasi faaliyetler zamanla kampanyanın ana aracı hâline geldi. Kurum içindeki etkinliğin dalgalansa da kamuoyundaki görünürlüğün seni ayrı bir güç merkezine dönüştürdü.',
        'COUNTERFACTUAL_SIMULATION',
        'Kamuoyu yolu',
        ['Görünürlük', 'Kitle desteği', 'Açık siyaset'],
      );
    }

    if (foreignRelations <= 30) {
      return ending(
        'ISOLATED_POWER',
        'Yalnız Güç',
        'İçeride tutundun, dışarıda kapılar kapandı.',
        'Kampanyanın sonunda hâlâ etkili bir güç merkezine sahiptin; fakat dış dünya ile kurduğun bağlar büyük ölçüde kopmuştu. İçeride kazandığın her alan, dışarıdaki yalnızlığın maliyetiyle birlikte geldi.',
        'COUNTERFACTUAL_SIMULATION',
        'İçe kapanma yolu',
        ['İç güç', 'Dış yalnızlık', 'Kırılgan denge'],
      );
    }

    if (publicSupport >= 70 && stability >= 45) {
      return ending(
        'POPULAR_ASCENDANCY',
        'Sokaktan Yükselen Güç',
        'Kamu desteği seni görünür bir aktöre dönüştürdü.',
        'Başlangıçta küçük çevrelerle kurduğun temas, yıllar içinde geniş bir destek ağına dönüştü. Kurumların tamamını kontrol etmesen bile siyasi ağırlığın artık yalnız kapalı odalarda değil, kamuoyunda da hissediliyordu.',
        'COUNTERFACTUAL_SIMULATION',
        'Kitle desteği yolu',
        ['Kamuoyu', 'Görünürlük', 'Siyasi ağırlık'],
      );
    }

    if (institutionalInfluence >= 70 && publicSupport <= 50) {
      return ending(
        'INSTITUTIONAL_NETWORK',
        'Gölgedeki Ağ',
        'Kalabalıklardan çok kurumların koridorlarında güçlendin.',
        'Kamuoyundaki etkin sınırlı kaldı; buna karşılık yıllar boyunca kurduğun kurum içi bağlantılar seni vazgeçilmesi zor bir aktöre dönüştürdü. Tarih sahnesinin önünde değil, perde arkasında belirleyici oldun.',
        'COUNTERFACTUAL_SIMULATION',
        'Kurum ağı yolu',
        ['Kurum etkisi', 'Düşük görünürlük', 'Bağlantılar'],
      );
    }

    if (
      publicSupport >= 40 && publicSupport <= 70 &&
      institutionalInfluence >= 40 && institutionalInfluence <= 70 &&
      stability >= 40 && stability <= 70 &&
      foreignRelations >= 40 && foreignRelations <= 70
    ) {
      return ending(
        'BALANCED_SURVIVAL',
        'Dengenin Ustası',
        'Hiçbir alanı tamamen ele geçirmedin; hiçbirini de kaybetmedin.',
        'Kampanya boyunca aşırı güçlenmek yerine dengede kalmayı seçtin. Kamuoyu, kurumlar, düzen ve dış ilişkiler arasında sürekli tavizler verdin. Sonuç büyük bir zafer değil, uzun süre ayakta kalabilen kırılgan bir denge oldu.',
        'COUNTERFACTUAL_SIMULATION',
        'Denge yolu',
        ['Denge', 'Esneklik', 'Süreklilik'],
      );
    }

    if (decisions >= 12) {
      return ending(
        'ALTERNATE_TERMINUS',
        'Başka Bir Yol',
        'Kararların tarih çizgisini farklı bir sona taşıdı.',
        'Yıllar boyunca verdiğin kararlar tek bir güç merkezini değil, birbirine bağlı yeni bir siyasi dengeyi ortaya çıkardı. Başlangıçtaki hedeflerin değişti; kampanyanın sonunda ortaya çıkan yapı, ilk adımlarında öngördüğünden farklıydı.',
        'COUNTERFACTUAL_SIMULATION',
        'Karma yol',
        ['Uyarlama', 'Dallanma', 'Alternatif çizgi'],
      );
    }

    return ending(
      'HISTORICAL_TERMINUS',
      'Kampanya tarihsel sınırına ulaştı',
      'Oynanabilir zaman çizgisinin sonuna geldin.',
      'Kampanya, Avrupa’daki savaşın 1945 tarihli bitiş sınırına ulaştı. Bu noktadan sonrası mevcut senaryonun kapsamı dışında kalıyor.',
      'HISTORICAL_FACT',
      'Tarihsel sınır',
      ['Zaman çizgisi', 'Kampanya sonu'],
    );
  }

  return null;
}
