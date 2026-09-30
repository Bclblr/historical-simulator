import type { DecisionEffect } from './decision-effect';
import { applyDecisionEffects } from './decision-effect';
import {
  addHistoricalDays,
  compareHistoricalDates,
  parseHistoricalDate,
  serializeHistoricalDate,
} from './historical-date';
import type { GameState } from './types';

export interface ScheduledDecisionEffect {
  id: string;
  dueDate: string;
  effects: DecisionEffect[];
  sequence: number;
}

export interface ScheduleDecisionEffectInput {
  id: string;
  delayDays: number;
  effects: DecisionEffect[];
}

export interface ProcessScheduledEffectsResult {
  state: GameState;
  pending: ScheduledDecisionEffect[];
  applied: ScheduledDecisionEffect[];
}

export function scheduleDecisionEffect(
  queue: ScheduledDecisionEffect[],
  state: GameState,
  input: ScheduleDecisionEffectInput,
): ScheduledDecisionEffect[] {
  const id = input.id.trim();
  if (!id) throw new Error('ScheduledDecisionEffect id is required.');
  if (!Number.isInteger(input.delayDays) || input.delayDays < 0) {
    throw new Error('ScheduledDecisionEffect delayDays must be a non-negative integer.');
  }
  if (queue.some((item) => item.id === id)) {
    throw new Error(`Duplicate ScheduledDecisionEffect id: ${id}.`);
  }

  const dueDate = serializeHistoricalDate(
    addHistoricalDays(parseHistoricalDate(state.currentDate), input.delayDays),
  );
  const sequence =
    queue.reduce((highest, item) => Math.max(highest, item.sequence), 0) + 1;

  return [...queue, { id, dueDate, effects: [...input.effects], sequence }];
}

export function processDueDecisionEffects(
  state: GameState,
  queue: ScheduledDecisionEffect[],
): ProcessScheduledEffectsResult {
  const currentDate = parseHistoricalDate(state.currentDate);
  const ordered = [...queue].sort((a, b) => {
    const byDate = compareHistoricalDates(
      parseHistoricalDate(a.dueDate),
      parseHistoricalDate(b.dueDate),
    );
    return byDate !== 0 ? byDate : a.sequence - b.sequence;
  });

  const due = ordered.filter(
    (item) => compareHistoricalDates(parseHistoricalDate(item.dueDate), currentDate) <= 0,
  );
  const pending = ordered.filter(
    (item) => compareHistoricalDates(parseHistoricalDate(item.dueDate), currentDate) > 0,
  );

  const nextState = due.reduce(
    (current, item) => applyDecisionEffects(current, item.effects),
    state,
  );

  return { state: nextState, pending, applied: due };
}
