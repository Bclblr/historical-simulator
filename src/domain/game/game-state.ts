import type { GameSelection, GameState } from './types';

export interface CreateGameStateInput {
  sessionId: string;
  startDate: string;
  selection: GameSelection;
}

export function createInitialGameState(input: CreateGameStateInput): GameState {
  return {
    sessionId: input.sessionId,
    currentDate: input.startDate,
    selection: input.selection,
    flags: {},
    variables: {},
  };
}
