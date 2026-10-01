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
