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
  | 'ALTERNATE_TERMINUS';

export interface CampaignProfile {
  playerName: string;
  campaignId: 'germany-1921' | 'germany-life';
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

export function evaluateGermanyCampaignEnding(
  snapshot: GameSessionSnapshot,
): CampaignEnding | null {
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
