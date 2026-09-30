import type { HistoricalEntityId } from '@/domain/history';
import type { DecisionOption, DecisionOptionId } from './decision';
import { parseHistoricalDate } from './historical-date';

export interface DecisionRecord {
  eventId: HistoricalEntityId;
  optionId: DecisionOptionId;
  decidedAt: string;
  sequence: number;
}

export interface RecordDecisionInput {
  option: DecisionOption;
  decidedAt: string;
}

export function recordDecision(
  history: DecisionRecord[],
  input: RecordDecisionInput,
): DecisionRecord[] {
  parseHistoricalDate(input.decidedAt);

  const nextSequence =
    history.reduce((highest, item) => Math.max(highest, item.sequence), 0) + 1;

  return [
    ...history,
    {
      eventId: input.option.eventId,
      optionId: input.option.id,
      decidedAt: input.decidedAt,
      sequence: nextSequence,
    },
  ];
}

export function hasDecisionForEvent(
  history: DecisionRecord[],
  eventId: HistoricalEntityId,
): boolean {
  return history.some((record) => record.eventId === eventId);
}

export function wasDecisionSelected(
  history: DecisionRecord[],
  eventId: HistoricalEntityId,
  optionId: DecisionOptionId,
): boolean {
  return history.some(
    (record) => record.eventId === eventId && record.optionId === optionId,
  );
}

export function getLatestDecisionForEvent(
  history: DecisionRecord[],
  eventId: HistoricalEntityId,
): DecisionRecord | null {
  return (
    history
      .filter((record) => record.eventId === eventId)
      .reduce<DecisionRecord | null>(
        (latest, record) =>
          latest === null || record.sequence > latest.sequence ? record : latest,
        null,
      )
  );
}
