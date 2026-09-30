import type { HistoricalEntityId } from '@/domain/history';
import type { SwipeDirection } from './swipe';

export type DecisionOptionId = string;

export interface DecisionOption {
  id: DecisionOptionId;
  eventId: HistoricalEntityId;
  label: string;
  description: string;
  swipeDirection: SwipeDirection | null;
}

export interface CreateDecisionOptionInput {
  id: DecisionOptionId;
  eventId: HistoricalEntityId;
  label: string;
  description?: string;
  swipeDirection?: SwipeDirection | null;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createDecisionOption(
  input: CreateDecisionOptionInput,
): DecisionOption {
  return {
    id: required(input.id, 'DecisionOption id'),
    eventId: required(input.eventId, 'DecisionOption eventId'),
    label: required(input.label, 'DecisionOption label'),
    description: input.description?.trim() ?? '',
    swipeDirection: input.swipeDirection ?? null,
  };
}

export function getSwipeDecision(
  options: DecisionOption[],
  direction: SwipeDirection,
): DecisionOption | null {
  const matches = options.filter((option) => option.swipeDirection === direction);
  if (matches.length > 1) {
    throw new Error(`Only one DecisionOption may be bound to ${direction} swipe.`);
  }
  return matches[0] ?? null;
}

export function getLeftDecision(options: DecisionOption[]): DecisionOption | null {
  return getSwipeDecision(options, 'LEFT');
}

export function getRightDecision(options: DecisionOption[]): DecisionOption | null {
  return getSwipeDecision(options, 'RIGHT');
}
