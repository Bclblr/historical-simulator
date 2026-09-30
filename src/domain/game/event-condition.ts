import type { HistoricalEntityId } from '@/domain/history';
import type { DecisionOptionId } from './decision';
import type { DecisionRecord } from './decision-history';
import { wasDecisionSelected } from './decision-history';
import { getGameFlag } from './game-flag';
import type { GameFlagKey, GameState, GameVariableKey } from './types';

export type VariableComparison = 'EQ' | 'NE' | 'GT' | 'GTE' | 'LT' | 'LTE';

export type EventCondition =
  | { type: 'FLAG'; key: GameFlagKey; expected: boolean }
  | {
      type: 'VARIABLE';
      key: GameVariableKey;
      comparison: VariableComparison;
      value: number;
    }
  | {
      type: 'DECISION';
      eventId: HistoricalEntityId;
      optionId: DecisionOptionId;
    };

export interface EventConditionContext {
  decisionHistory: DecisionRecord[];
}

function compareVariable(
  actual: number,
  comparison: VariableComparison,
  expected: number,
): boolean {
  switch (comparison) {
    case 'EQ': return actual === expected;
    case 'NE': return actual !== expected;
    case 'GT': return actual > expected;
    case 'GTE': return actual >= expected;
    case 'LT': return actual < expected;
    case 'LTE': return actual <= expected;
  }
}

export function matchesEventCondition(
  state: GameState,
  condition: EventCondition,
  context: EventConditionContext,
): boolean {
  switch (condition.type) {
    case 'FLAG':
      return getGameFlag(state, condition.key) === condition.expected;
    case 'VARIABLE':
      if (!Number.isFinite(condition.value)) {
        throw new Error('EventCondition variable value must be finite.');
      }
      return compareVariable(
        state.variables[condition.key] ?? 0,
        condition.comparison,
        condition.value,
      );
    case 'DECISION':
      return wasDecisionSelected(
        context.decisionHistory,
        condition.eventId,
        condition.optionId,
      );
  }
}

export function matchesAllEventConditions(
  state: GameState,
  conditions: EventCondition[],
  context: EventConditionContext,
): boolean {
  return conditions.every((condition) =>
    matchesEventCondition(state, condition, context),
  );
}
