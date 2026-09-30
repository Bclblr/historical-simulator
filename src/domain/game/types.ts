import type { HistoricalEntityId } from '@/domain/history/types';

export type GameSessionId = string;

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
  flags: Record<string, boolean>;
  variables: Record<string, number>;
}
