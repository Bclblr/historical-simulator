import type { GameState } from './types';
import {
  compareHistoricalDates,
  parseHistoricalDate,
} from './historical-date';
import type { HistoricalEvent } from '@/domain/history';

export interface EventEligibilityResult {
  eligible: boolean;
  reasons: EventIneligibilityReason[];
}

export type EventIneligibilityReason =
  | 'NOT_PUBLISHED'
  | 'ERA_MISMATCH'
  | 'COUNTRY_MISMATCH'
  | 'INSTITUTION_MISMATCH'
  | 'NOT_STARTED'
  | 'ENDED';

function includesOrGlobal(ids: string[], selectedId: string): boolean {
  return ids.length === 0 || ids.includes(selectedId);
}

export function evaluateEventEligibility(
  event: HistoricalEvent,
  state: GameState,
): EventEligibilityResult {
  const reasons: EventIneligibilityReason[] = [];

  if (event.status !== 'PUBLISHED') reasons.push('NOT_PUBLISHED');
  if (event.eraId !== state.selection.eraId) reasons.push('ERA_MISMATCH');
  if (!includesOrGlobal(event.countryIds, state.selection.countryId)) {
    reasons.push('COUNTRY_MISMATCH');
  }
  if (!includesOrGlobal(event.institutionIds, state.selection.institutionId)) {
    reasons.push('INSTITUTION_MISMATCH');
  }

  const currentDate = parseHistoricalDate(state.currentDate);
  const startDate = parseHistoricalDate(event.startDate);
  const endDate = event.endDate ? parseHistoricalDate(event.endDate) : null;

  if (compareHistoricalDates(currentDate, startDate) < 0) reasons.push('NOT_STARTED');
  if (endDate && compareHistoricalDates(currentDate, endDate) > 0) reasons.push('ENDED');

  return { eligible: reasons.length === 0, reasons };
}

export function getEligibleEvents(
  events: HistoricalEvent[],
  state: GameState,
): HistoricalEvent[] {
  return events
    .filter((event) => evaluateEventEligibility(event, state).eligible)
    .sort((a, b) => {
      const byDate = compareHistoricalDates(
        parseHistoricalDate(a.startDate),
        parseHistoricalDate(b.startDate),
      );
      return byDate !== 0 ? byDate : a.sortOrder - b.sortOrder;
    });
}

export function getNextEligibleEvent(
  events: HistoricalEvent[],
  state: GameState,
): HistoricalEvent | null {
  return getEligibleEvents(events, state)[0] ?? null;
}
