import type { HistoricalEntityId } from './types';
import type { HistoricalCitation } from './citation';
import type { HistoricalSource } from './source';
import {
  getSourceDisplaysForTarget,
  type SourceDisplay,
} from './source-display';

export interface HistorianInterpretation {
  id: HistoricalEntityId;
  eventId: HistoricalEntityId;
  historianName: string;
  thesis: string;
  citations: SourceDisplay[];
}

export interface CreateHistorianInterpretationInput {
  id: HistoricalEntityId;
  eventId: HistoricalEntityId;
  historianName: string;
  thesis: string;
  citationIds: HistoricalEntityId[];
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createHistorianInterpretation(
  input: CreateHistorianInterpretationInput,
  citations: HistoricalCitation[],
  sources: HistoricalSource[],
): HistorianInterpretation {
  const id = required(input.id, 'HistorianInterpretation id');
  const eventId = required(input.eventId, 'HistorianInterpretation eventId');
  const citationIds = new Set(input.citationIds);
  const selectedCitations = citations.filter(
    (citation) =>
      citationIds.has(citation.id) &&
      citation.targetType === 'EVENT' &&
      citation.targetId === eventId,
  );

  if (selectedCitations.length !== citationIds.size) {
    throw new Error(
      'HistorianInterpretation citations must exist and target the same event.',
    );
  }

  return {
    id,
    eventId,
    historianName: required(
      input.historianName,
      'HistorianInterpretation historianName',
    ),
    thesis: required(input.thesis, 'HistorianInterpretation thesis'),
    citations: getSourceDisplaysForTarget(
      selectedCitations,
      sources,
      eventId,
    ),
  };
}

export function getInterpretationsForEvent(
  interpretations: HistorianInterpretation[],
  eventId: HistoricalEntityId,
): HistorianInterpretation[] {
  return interpretations.filter(
    (interpretation) => interpretation.eventId === eventId,
  );
}
