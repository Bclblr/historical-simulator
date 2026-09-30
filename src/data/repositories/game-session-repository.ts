import type { GameSessionId, GameSessionSnapshot } from '@/domain/game';

export interface GameSessionRepository {
  findById(sessionId: GameSessionId): Promise<GameSessionSnapshot | null>;
  findMostRecent(): Promise<GameSessionSnapshot | null>;
  save(snapshot: GameSessionSnapshot): Promise<void>;
}
