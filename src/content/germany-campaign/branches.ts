import { createHistoricalEvent, type HistoricalEvent } from '@/domain/history';
import type { DecisionRecord } from '@/domain/game';

interface BranchDefinition {
  sourceEventId: string;
  optionSuffix: string;
  event: HistoricalEvent;
}

const branch = (
  id: string,
  sourceEventId: string,
  optionSuffix: string,
  title: string,
  summary: string,
  startDate: string,
  sortOrder: number,
): BranchDefinition => ({
  sourceEventId,
  optionSuffix,
  event: createHistoricalEvent({
    id,
    eraId: 'germany-1921',
    countryIds: ['germany'],
    title,
    summary,
    startDate,
    scope: 'NATIONAL',
    classification: 'COUNTERFACTUAL_SIMULATION',
    sortOrder,
    status: 'PUBLISHED',
  }),
});

const BRANCHES: BranchDefinition[] = [
  branch(
    'alt-1921-shared-party-leadership',
    'de-1921-leadership-struggle',
    'negotiate-leadership',
    'Parti yönetiminde güç paylaşımı oluştu',
    'Önceki kararınız sonucunda parti yönetimi tek merkezde toplanmadı. Bu gelişme tarihsel kayıt değil, alternatif simülasyon dalıdır.',
    '1921-07-18',
    901,
  ),
  branch(
    'alt-1921-open-leadership-contest',
    'de-1921-leadership-struggle',
    'challenge-leadership',
    'Parti içinde açık liderlik mücadelesi başladı',
    'Önceki kararınız parti içindeki güç mücadelesini açık bir liderlik yarışına dönüştürdü. Bu kart alternatif simülasyondur.',
    '1921-07-18',
    902,
  ),
  branch(
    'alt-1921-collective-authority',
    'de-1921-hitler-returns-with-conditions',
    'shared-authority',
    'Kolektif yönetim modeli kabul edildi',
    'Parti komitesiyle yetki paylaşımı kabul edildi. Sonraki örgütsel gelişmeler artık belgelenmiş tarihsel çizgiden ayrılabilir.',
    '1921-07-28',
    903,
  ),
  branch(
    'alt-1920-broader-program',
    'de-1920-party-program',
    'broaden-program',
    'Parti programı daha geniş seçmen gruplarına yöneldi',
    'Program tercihleri hareketin siyasi kimliğini farklı bir yola taşıdı. Bu kart tarihsel olay değil, kararınızdan türetilen simülasyondur.',
    '1920-03-01',
    904,
  ),
  branch(
    'alt-1932-coalition-negotiations',
    'de-1932-july-election',
    'broaden-campaign',
    'Koalisyon görüşmeleri öne çıktı',
    'Seçim sonrasında daha geniş parlamenter destek arayışı alternatif bir hükûmet kurma sürecini gündeme getirdi.',
    '1932-08-05',
    905,
  ),
  branch(
    'alt-1936-rhineland-negotiation',
    'de-1936-rhineland',
    'seek-negotiation',
    'Ren krizi diplomatik görüşmelere yöneldi',
    'Gerilimi müzakere yoluyla sınırlama tercihi uluslararası ilişkilerde farklı bir yol açtı. Bu kart alternatif simülasyondur.',
    '1936-03-10',
    906,
  ),
  branch('alt-1920-program-coalition','alt-1920-broader-program','moderate-response','Program uzlaşması yeni bir parti koalisyonu doğurdu','Daha geniş program çizgisi farklı siyasi çevrelerle iş birliği olasılığını artırdı. Bu alternatif simülasyon kartıdır.','1920-04-10',907),
  branch('alt-1921-committee-charter','alt-1921-shared-party-leadership','moderate-response','Parti komitesi için yeni yetki düzeni hazırlandı','Güç paylaşımının sürmesi üzerine parti içi yetkileri tanımlayan alternatif bir örgüt modeli gündeme geldi.','1921-08-05',908),
  branch('alt-1923-deescalation','de-1923-crisis-year','limit-escalation','1923 krizinde siyasi gerilim sınırlanmaya çalışıldı','Kriz sırasında çatışmayı büyütmek yerine yasal ve siyasi kanallara ağırlık verilmesi farklı bir parti stratejisi doğurdu.','1923-09-01',909),
  branch('alt-1924-parliamentary-path','de-1924-hitler-trial','protect-procedure','Hareket parlamenter yönteme yöneldi','Yargılama sonrasında hareketin şiddet dışı ve seçim odaklı siyasi yönteme daha erken yönelmesi alternatif bir gelişme çizgisi oluşturdu.','1924-04-10',910),
  branch('alt-1928-electoral-broadening','de-1928-reichstag-election','broaden-campaign','1928 yenilgisi sonrası seçmen tabanı yeniden değerlendirildi','Düşük seçim desteğinin ardından daha geniş seçmen gruplarına yönelme kararı alternatif bir örgütlenme stratejisi oluşturdu.','1928-06-01',911),
  branch('alt-1929-economic-moderation','de-1929-great-depression','social-relief','Ekonomik krize sosyal politika ağırlıklı yanıt geliştirildi','Ekonomik kriz karşısında toplumsal yükü azaltmaya öncelik verilmesi siyasi rekabetin seyrini değiştirebilecek alternatif bir çizgi açtı.','1929-11-15',912),
  branch('alt-1930-coalition-opening','de-1930-reichstag-breakthrough','broaden-campaign','Parlamentoda iş birliği arayışı başladı','Seçim başarısından sonra tek başına güç toplamak yerine parlamenter iş birliği arayışı öne çıktı.','1930-09-25',913),
  branch('alt-1932-presidential-moderation','de-1932-presidential-second-round','broaden-campaign','Cumhurbaşkanlığı yenilgisi sonrası strateji değişti','Seçim yenilgisinin ardından daha geniş siyasi uzlaşmaya yönelen alternatif bir strateji gündeme geldi.','1932-04-20',914),
  branch('alt-1932-parliamentary-coalition','alt-1932-coalition-negotiations','moderate-response','Parlamenter koalisyon taslağı oluştu','Alternatif görüşmeler sonucunda farklı partiler arasında sınırlı bir koalisyon zemini ortaya çıktı.','1932-08-12',915),
  branch('alt-1933-constitutional-restraint','de-1933-reichstag-fire','request-legal-review','Olağanüstü yetkilere kurumsal sınır getirildi','Hukuki incelemenin ağırlık kazanması temel hakları sınırlayan olağanüstü düzenlemelerin kapsamını değiştiren alternatif bir çizgi oluşturdu.','1933-03-01',916),
  branch('alt-1933-parliamentary-checks','de-1933-reichstag-election','parliamentary-analysis','Parlamenter denetim güçlendirildi','Seçim sonrasında kurumsal denetimi korumaya yönelik alternatif bir parlamento düzeni gelişti.','1933-03-12',917),
  branch('alt-1935-legal-resistance','de-1935-nuremberg-laws','protect-procedure','Ayrımcı mevzuata kurumsal itiraz büyüdü','Hukuki sınırların korunması tercihi, ayrımcı mevzuata karşı kurum içi direncin güçlendiği alternatif bir zaman çizgisi açtı.','1935-09-20',918),
  branch('alt-1936-rhineland-conference','alt-1936-rhineland-negotiation','moderate-response','Ren krizi için uluslararası konferans toplandı','Diplomatik çizginin sürdürülmesi krizin çok taraflı görüşmelere taşındığı alternatif bir senaryo doğurdu.','1936-03-20',919),
  branch('alt-1938-austria-negotiation','de-1938-anschluss','seek-negotiation','Avusturya krizi müzakereye taşındı','Tek taraflı ilhak yerine diplomatik müzakereye yönelme kararı Orta Avrupa’daki siyasi dengeyi değiştiren alternatif bir dal açtı.','1938-03-15',920),
  branch('alt-1938-munich-multilateral','de-1938-munich-agreement','seek-negotiation','Çekoslovak temsilinin katıldığı yeni görüşmeler gündeme geldi','Kriz yönetiminde daha geniş diplomatik katılımın aranması farklı bir anlaşma ihtimalini ortaya çıkardı.','1938-10-02',921),
  branch('alt-1939-poland-negotiation','de-1939-poland-invasion','limit-escalation','Polonya krizi son anda diplomatik kanala döndü','Askerî tırmanmayı sınırlama tercihi, savaşın başlangıcını değiştirebilecek alternatif bir diplomatik kriz oluşturdu.','1939-09-02',922),
  branch('alt-1939-european-conference','alt-1939-poland-negotiation','moderate-response','Avrupa krizi için acil konferans çağrısı yapıldı','Alternatif diplomatik süreç, büyük güçlerin yeni bir konferans girişiminde bulunduğu ayrı bir zaman çizgisi oluşturdu.','1939-09-04',923),
  branch('alt-1940-western-deescalation','de-1940-western-offensive','limit-escalation','Batı Cephesi’nde siyasi çözüm arayışı öne çıktı','Askerî genişleme yerine gerilimi sınırlama tercihi savaşın Batı Avrupa’daki seyrini değiştiren alternatif bir dal oluşturdu.','1940-05-12',924),
  branch('alt-1941-eastern-war-avoided','de-1941-barbarossa','limit-escalation','Doğu Avrupa’da savaşın genişlemesi ertelendi','Sovyetler Birliği’ne karşı askerî tırmanmayı sınırlama kararı savaşın coğrafyasını değiştiren alternatif bir zaman çizgisi açtı.','1941-06-24',925),
  branch('alt-1941-us-war-avoided','de-1941-germany-declares-war-us','limit-escalation','ABD ile doğrudan savaş genişlemedi','ABD ile doğrudan savaşın genişletilmemesi Atlantik savaşının siyasi çerçevesini değiştiren alternatif bir dal oluşturdu.','1941-12-12',926),
  branch('alt-1943-post-stalingrad-policy','de-1943-stalingrad-surrender','limit-escalation','Stalingrad sonrası savaş politikasının değiştirilmesi tartışıldı','Askerî yenilginin ardından savaşın kapsamını azaltmaya dönük siyasi seçeneklerin tartışıldığı alternatif bir süreç başladı.','1943-02-05',927),
  branch('alt-1944-negotiated-exit','de-1944-july-plot','limit-escalation','Savaşın sona erdirilmesine yönelik temaslar gündeme geldi','1944 krizinin ardından savaşın sona erdirilmesi için siyasi temasların öne çıktığı alternatif bir zaman çizgisi oluştu.','1944-07-25',928)
];

export function getGermanyCampaignBranchEvents(history: DecisionRecord[]): HistoricalEvent[] {
  return BRANCHES
    .filter((definition) =>
      history.some(
        (record) =>
          record.eventId === definition.sourceEventId &&
          record.optionId.endsWith(`:${definition.optionSuffix}`),
      ),
    )
    .map((definition) => definition.event);
}


const EXCLUSIONS: Array<{ sourceEventId: string; optionSuffix: string; excludedEventIds: string[] }> = [
  {
    sourceEventId: 'de-1921-hitler-returns-with-conditions',
    optionSuffix: 'shared-authority',
    excludedEventIds: ['de-1921-hitler-party-leadership'],
  },
  {
    sourceEventId: 'de-1939-poland-invasion',
    optionSuffix: 'limit-escalation',
    excludedEventIds: ['de-1939-britain-france-war', 'de-1939-poland-divided'],
  },
  {
    sourceEventId: 'de-1941-barbarossa',
    optionSuffix: 'limit-escalation',
    excludedEventIds: ['de-1941-mass-murder-escalation'],
  },
  {
    sourceEventId: 'de-1941-germany-declares-war-us',
    optionSuffix: 'limit-escalation',
    excludedEventIds: [],
  },
];

export function getGermanyCampaignExcludedEventIds(history: DecisionRecord[]): Set<string> {
  const excluded = new Set<string>();
  for (const rule of EXCLUSIONS) {
    const matched = history.some(
      (record) =>
        record.eventId === rule.sourceEventId &&
        record.optionId.endsWith(`:${rule.optionSuffix}`),
    );
    if (matched) rule.excludedEventIds.forEach((id) => excluded.add(id));
  }
  return excluded;
}
