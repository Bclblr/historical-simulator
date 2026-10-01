import type { GameState, GameVariableKey } from './types';
import { withGameDate, withGameVariable } from './game-state';
import {
  addHistoricalDays,
  parseHistoricalDate,
  serializeHistoricalDate,
} from './historical-date';

export type DecisionEffect =
  | {
      type: 'SET_VARIABLE';
      key: GameVariableKey;
      value: number;
    }
  | {
      type: 'CHANGE_VARIABLE';
      key: GameVariableKey;
      delta: number;
    }
  | {
      type: 'ADVANCE_DAYS';
      days: number;
    };

function assertFinite(value: number, field: string): void {
  if (!Number.isFinite(value)) throw new Error(`${field} must be finite.`);
}

export function applyDecisionEffect(
  state: GameState,
  effect: DecisionEffect,
): GameState {
  switch (effect.type) {
    case 'SET_VARIABLE':
      assertFinite(effect.value, 'DecisionEffect value');
      return withGameVariable(state, effect.key, effect.value);

    case 'CHANGE_VARIABLE': {
      assertFinite(effect.delta, 'DecisionEffect delta');
      const current = state.variables[effect.key] ?? 0;
      const isCampaignMeter = ['publicSupport', 'institutionalInfluence', 'stability', 'foreignRelations'].includes(effect.key);
      const scaledDelta = isCampaignMeter
        ? Math.sign(effect.delta) * Math.max(3, Math.round(Math.abs(effect.delta) * 2.5))
        : effect.delta;
      const next = current + scaledDelta;
      assertFinite(next, 'DecisionEffect resulting variable');
      return withGameVariable(state, effect.key, next);
    }

    case 'ADVANCE_DAYS': {
      if (!Number.isInteger(effect.days)) {
        throw new Error('DecisionEffect days must be an integer.');
      }
      const nextDate = addHistoricalDays(parseHistoricalDate(state.currentDate), effect.days);
      return withGameDate(state, serializeHistoricalDate(nextDate));
    }
  }
}

export function applyDecisionEffects(
  state: GameState,
  effects: DecisionEffect[],
): GameState {
  return effects.reduce(applyDecisionEffect, state);
}
