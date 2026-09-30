import type { GameFlagKey, GameState } from './types';
import { withGameFlag } from './game-state';

export interface GameFlagCondition {
  key: GameFlagKey;
  expected: boolean;
}

function normalizeKey(key: GameFlagKey): GameFlagKey {
  const normalized = key.trim();
  if (!normalized) throw new Error('GameFlag key is required.');
  return normalized;
}

export function getGameFlag(
  state: GameState,
  key: GameFlagKey,
  defaultValue = false,
): boolean {
  const normalizedKey = normalizeKey(key);
  return state.flags[normalizedKey] ?? defaultValue;
}

export function setGameFlag(
  state: GameState,
  key: GameFlagKey,
  value: boolean,
): GameState {
  return withGameFlag(state, normalizeKey(key), value);
}

export function matchesGameFlagCondition(
  state: GameState,
  condition: GameFlagCondition,
): boolean {
  return getGameFlag(state, condition.key) === condition.expected;
}

export function matchesAllGameFlagConditions(
  state: GameState,
  conditions: GameFlagCondition[],
): boolean {
  return conditions.every((condition) => matchesGameFlagCondition(state, condition));
}

export function matchesAnyGameFlagCondition(
  state: GameState,
  conditions: GameFlagCondition[],
): boolean {
  return conditions.some((condition) => matchesGameFlagCondition(state, condition));
}
