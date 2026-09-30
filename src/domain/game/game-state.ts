import type {
  GameFlagKey,
  GameSelection,
  GameState,
  GameVariableKey,
} from './types';

export interface CreateGameStateInput {
  sessionId: string;
  startDate: string;
  selection: GameSelection;
  flags?: Record<GameFlagKey, boolean>;
  variables?: Record<GameVariableKey, number>;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertNonEmpty(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function assertGameDate(value: string): void {
  if (!ISO_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error('GameState currentDate must be a valid date (YYYY-MM-DD).');
  }
}

function normalizeFlags(
  flags: Record<GameFlagKey, boolean> | undefined,
): Record<GameFlagKey, boolean> {
  return Object.fromEntries(
    Object.entries(flags ?? {})
      .map(([key, value]) => [key.trim(), value] as const)
      .filter(([key]) => Boolean(key)),
  );
}

function normalizeVariables(
  variables: Record<GameVariableKey, number> | undefined,
): Record<GameVariableKey, number> {
  const entries = Object.entries(variables ?? {})
    .map(([key, value]) => [key.trim(), value] as const)
    .filter(([key]) => Boolean(key));

  if (entries.some(([, value]) => !Number.isFinite(value))) {
    throw new Error('GameState variables must contain only finite numbers.');
  }

  return Object.fromEntries(entries);
}

export function createInitialGameState(input: CreateGameStateInput): GameState {
  const sessionId = assertNonEmpty(input.sessionId, 'GameState sessionId');
  assertGameDate(input.startDate);

  const selection: GameSelection = {
    eraId: assertNonEmpty(input.selection.eraId, 'GameSelection eraId'),
    countryId: assertNonEmpty(input.selection.countryId, 'GameSelection countryId'),
    institutionId: assertNonEmpty(
      input.selection.institutionId,
      'GameSelection institutionId',
    ),
    roleId: assertNonEmpty(input.selection.roleId, 'GameSelection roleId'),
  };

  return {
    sessionId,
    currentDate: input.startDate,
    selection,
    flags: normalizeFlags(input.flags),
    variables: normalizeVariables(input.variables),
  };
}

export function withGameDate(state: GameState, currentDate: string): GameState {
  assertGameDate(currentDate);
  return { ...state, currentDate };
}

export function withGameFlag(
  state: GameState,
  key: GameFlagKey,
  value: boolean,
): GameState {
  const normalizedKey = assertNonEmpty(key, 'GameFlag key');
  return { ...state, flags: { ...state.flags, [normalizedKey]: value } };
}

export function withGameVariable(
  state: GameState,
  key: GameVariableKey,
  value: number,
): GameState {
  const normalizedKey = assertNonEmpty(key, 'GameVariable key');
  if (!Number.isFinite(value)) {
    throw new Error('GameVariable value must be finite.');
  }

  return { ...state, variables: { ...state.variables, [normalizedKey]: value } };
}
