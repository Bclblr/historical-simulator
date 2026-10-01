import type { HistoricalEntityId } from './types';
import type { HistoricalEvent } from './historical-event';
import type { HistoricalCitation } from './citation';
import type { HistoricalSource } from './source';
import { assertHistoricalEvidence } from './content-integrity';
import {
  getSourceDisplaysForTarget,
  type SourceDisplay,
} from './source-display';

export interface HistoricalOutcome {
  eventId: HistoricalEntityId;
  title: string;
  summary: string;
  startDate: string;
  endDate: string | null;
  sources: SourceDisplay[];
}

export function createHistoricalOutcome(
  event: HistoricalEvent,
  citations: HistoricalCitation[],
  sources: HistoricalSource[],
): HistoricalOutcome {
  assertHistoricalEvidence(event.classification, 'HistoricalOutcome event');

  const eventCitations = citations.filter(
    (citation) =>
      citation.targetType === 'EVENT' && citation.targetId === event.id,
  );

  return {
    eventId: event.id,
    title: event.title,
    summary: event.summary,
    startDate: event.startDate,
    endDate: event.endDate,
    sources: getSourceDisplaysForTarget(eventCitations, sources, event.id),
  };
}
