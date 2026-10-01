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
  campaignId: 'germany-1921';
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
): CampaignEnding {
  return {
    id,
    title,
    subtitle,
    description,
    classification,
    imageKey: null,
  };
}

export function evaluateGermanyCampaignEnding(
  snapshot: GameSessionSnapshot,
): CampaignEnding | null {
  const publicSupport = value(snapshot, 'publicSupport');
  const institutionalInfluence = value(snapshot, 'institutionalInfluence');
  const stability = value(snapshot, 'stability');
  const foreignRelations = value(snapshot, 'foreignRelations');
  const decisions = snapshot.decisionHistory.length;
  const date = snapshot.state.currentDate;

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
    if (foreignRelations <= 30) {
      return ending(
        'ISOLATED_POWER',
        'Yalnız Güç',
        'İçeride tutundun, dışarıda kapılar kapandı.',
        'Kampanyanın sonunda hâlâ etkili bir güç merkezine sahiptin; fakat dış dünya ile kurduğun bağlar büyük ölçüde kopmuştu. İçeride kazandığın her alan, dışarıdaki yalnızlığın maliyetiyle birlikte geldi.',
      );
    }

    if (publicSupport >= 70 && stability >= 45) {
      return ending(
        'POPULAR_ASCENDANCY',
        'Sokaktan Yükselen Güç',
        'Kamu desteği seni görünür bir aktöre dönüştürdü.',
        'Başlangıçta küçük çevrelerle kurduğun temas, yıllar içinde geniş bir destek ağına dönüştü. Kurumların tamamını kontrol etmesen bile siyasi ağırlığın artık yalnız kapalı odalarda değil, kamuoyunda da hissediliyordu.',
      );
    }

    if (institutionalInfluence >= 70 && publicSupport <= 50) {
      return ending(
        'INSTITUTIONAL_NETWORK',
        'Gölgedeki Ağ',
        'Kalabalıklardan çok kurumların koridorlarında güçlendin.',
        'Kamuoyundaki etkin sınırlı kaldı; buna karşılık yıllar boyunca kurduğun kurum içi bağlantılar seni vazgeçilmesi zor bir aktöre dönüştürdü. Tarih sahnesinin önünde değil, perde arkasında belirleyici oldun.',
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
      );
    }

    if (decisions >= 12) {
      return ending(
        'ALTERNATE_TERMINUS',
        'Başka Bir Yol',
        'Kararların tarih çizgisini farklı bir sona taşıdı.',
        'Yıllar boyunca verdiğin kararlar tek bir güç merkezini değil, birbirine bağlı yeni bir siyasi dengeyi ortaya çıkardı. Başlangıçtaki hedeflerin değişti; kampanyanın sonunda ortaya çıkan yapı, ilk adımlarında öngördüğünden farklıydı.',
      );
    }

    return ending(
      'HISTORICAL_TERMINUS',
      'Kampanya tarihsel sınırına ulaştı',
      'Oynanabilir zaman çizgisinin sonuna geldin.',
      'Kampanya, Avrupa’daki savaşın 1945 tarihli bitiş sınırına ulaştı. Bu noktadan sonrası mevcut senaryonun kapsamı dışında kalıyor.',
      'HISTORICAL_FACT',
    );
  }

  return null;
}
