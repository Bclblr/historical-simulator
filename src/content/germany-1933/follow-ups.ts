import type { HistoricalEvent } from '@/domain/history';
import { createHistoricalEvent } from '@/domain/history';
import type { DecisionRecord } from '@/domain/game';
import { getGermany1933CardVisual } from './card-visuals';

export interface Germany1933FollowUp {
  event: HistoricalEvent;
  prompt: string;
  speaker: string;
  sourceEventId: string;
}

function hasFollowUpDecision(history: DecisionRecord[], sourceEventId: string): boolean {
  return history.some((record) => record.eventId === `${sourceEventId}:follow-up`);
}

export function createGermany1933FollowUp(
  sourceEvent: HistoricalEvent,
  history: DecisionRecord[],
): Germany1933FollowUp | null {
  const sourceDecision = [...history]
    .filter((record) => record.eventId === sourceEvent.id)
    .sort((a, b) => b.sequence - a.sequence)[0];

  if (!sourceDecision || hasFollowUpDecision(history, sourceEvent.id)) return null;

  const visual = getGermany1933CardVisual(sourceEvent.id);
  const reviewed = /review|analysis|document/.test(sourceDecision.optionId);
  const title = reviewed
    ? `${sourceEvent.title}: inceleme sonrası`
    : `${sourceEvent.title}: uygulama sonrası`;

  const summary = reviewed
    ? `${sourceEvent.title} sonrasında istediğiniz ek değerlendirme kuruma ulaştı. Bu kart, tarihsel olayın kendisi değil; önceki kararınızdan üretilen simülasyon sonucudur.`
    : `${sourceEvent.title} sonrasında uygulama dosyası yeniden önünüze geldi. Bu kart, tarihsel olayın kendisi değil; önceki kararınızdan üretilen simülasyon sonucudur.`;

  return {
    sourceEventId: sourceEvent.id,
    speaker: visual.label,
    prompt: reviewed
      ? 'Takip değerlendirmesi geldi. Kurum bu aşamada nasıl hareket etsin?'
      : 'Uygulamanın ilk sonuçları geldi. Kurum bu aşamada nasıl hareket etsin?',
    event: createHistoricalEvent({
      id: `${sourceEvent.id}:follow-up`,
      eraId: sourceEvent.eraId,
      countryIds: sourceEvent.countryIds,
      institutionIds: sourceEvent.institutionIds,
      personIds: sourceEvent.personIds,
      title,
      summary,
      startDate: sourceEvent.startDate,
      scope: sourceEvent.scope,
      classification: 'COUNTERFACTUAL_SIMULATION',
      sortOrder: sourceEvent.sortOrder,
      status: 'PUBLISHED',
    }),
  };
}
