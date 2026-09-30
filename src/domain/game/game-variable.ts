import type { GameState, GameVariableKey } from './types';

export type GameVariableVisibility = 'VISIBLE' | 'HIDDEN';

export interface GameVariableDefinition {
  key: GameVariableKey;
  visibility: GameVariableVisibility;
  defaultValue: number;
}

export interface VisibleGameVariable {
  key: GameVariableKey;
  value: number;
}

export function createGameVariableDefinition(
  key: GameVariableKey,
  visibility: GameVariableVisibility,
  defaultValue = 0,
): GameVariableDefinition {
  const normalizedKey = key.trim();
  if (!normalizedKey) throw new Error('GameVariableDefinition key is required.');
  if (!Number.isFinite(defaultValue)) {
    throw new Error('GameVariableDefinition defaultValue must be finite.');
  }

  return { key: normalizedKey, visibility, defaultValue };
}

export function getGameVariableValue(
  state: GameState,
  definition: GameVariableDefinition,
): number {
  return state.variables[definition.key] ?? definition.defaultValue;
}

export function getVisibleGameVariables(
  state: GameState,
  definitions: GameVariableDefinition[],
): VisibleGameVariable[] {
  const keys = new Set<string>();

  return definitions
    .filter((definition) => definition.visibility === 'VISIBLE')
    .map((definition) => {
      if (keys.has(definition.key)) {
        throw new Error(`Duplicate GameVariableDefinition key: ${definition.key}.`);
      }
      keys.add(definition.key);
      return {
        key: definition.key,
        value: getGameVariableValue(state, definition),
      };
    });
}

export function isGameVariableVisible(
  definition: GameVariableDefinition,
): boolean {
  return definition.visibility === 'VISIBLE';
}
