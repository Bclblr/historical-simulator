import type { HistoricalEntityId } from '@/domain/history/types';
import type { DecisionRecord } from './decision-history';
import type { ScheduledDecisionEffect } from './delayed-effect';

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

export interface GameSessionSnapshot {
  state: GameState;
  decisionHistory: DecisionRecord[];
  scheduledEffects: ScheduledDecisionEffect[];
}
