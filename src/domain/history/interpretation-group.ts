import type { HistoricalEntityId } from './types';
import type { HistorianInterpretation } from './historian-interpretation';

export interface InterpretationGroup {
  eventId: HistoricalEntityId;
  interpretations: HistorianInterpretation[];
  hasMultipleInterpretations: boolean;
}

export function createInterpretationGroup(
  eventId: HistoricalEntityId,
  interpretations: HistorianInterpretation[],
): InterpretationGroup {
  const normalizedEventId = eventId.trim();
  if (!normalizedEventId) {
    throw new Error('InterpretationGroup eventId is required.');
  }

  const matching = interpretations.filter(
    (interpretation) => interpretation.eventId === normalizedEventId,
  );

  const seenIds = new Set<HistoricalEntityId>();
  for (const interpretation of matching) {
    if (seenIds.has(interpretation.id)) {
      throw new Error('InterpretationGroup contains a duplicate interpretation.');
    }
    seenIds.add(interpretation.id);
  }

  return {
    eventId: normalizedEventId,
    interpretations: matching,
    hasMultipleInterpretations: matching.length > 1,
  };
}
