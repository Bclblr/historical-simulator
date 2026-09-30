import type { GameSessionId, GameState } from '@/domain/game';

export interface GameSessionRepository {
  findById(sessionId: GameSessionId): Promise<GameState | null>;
  findMostRecent(): Promise<GameState | null>;
  save(state: GameState): Promise<void>;
}
