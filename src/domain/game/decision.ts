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

export function validateDecisionOptions(
  eventId: HistoricalEntityId,
  options: DecisionOption[],
): DecisionOption[] {
  const normalizedEventId = required(eventId, 'Decision option set eventId');
  const ids = new Set<string>();

  for (const option of options) {
    if (option.eventId !== normalizedEventId) {
      throw new Error('All DecisionOptions must belong to the same event.');
    }
    if (ids.has(option.id)) {
      throw new Error(`Duplicate DecisionOption id: ${option.id}.`);
    }
    ids.add(option.id);
  }

  getLeftDecision(options);
  getRightDecision(options);
  return [...options];
}

export function getDecisionById(
  options: DecisionOption[],
  optionId: DecisionOptionId,
): DecisionOption | null {
  const normalizedId = required(optionId, 'DecisionOption id');
  return options.find((option) => option.id === normalizedId) ?? null;
}

export function getDirectDecisions(options: DecisionOption[]): DecisionOption[] {
  return options.filter((option) => option.swipeDirection === null);
}
