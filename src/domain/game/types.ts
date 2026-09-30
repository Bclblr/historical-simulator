import type { HistoricalEntityId } from '@/domain/history/types';

export type GameSessionId = string;
export type GameFlagKey = string;
export type GameVariableKey = string;

export interface GameSelection {
  eraId: HistoricalEntityId;
  countryId: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  roleId: HistoricalEntityId;
}

export interface GameState {
  sessionId: GameSessionId;
  currentDate: string;
  selection: GameSelection;
  flags: Record<GameFlagKey, boolean>;
  variables: Record<GameVariableKey, number>;
}
