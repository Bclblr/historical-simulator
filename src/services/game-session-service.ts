import { createInitialGameState, type GameSelection, type GameState } from '@/domain/game';
import type { GameSessionRepository } from '@/data/repositories';

export interface StartGameInput {
  sessionId: string;
  startDate: string;
  selection: GameSelection;
}

export class GameSessionService {
  constructor(private readonly sessions: GameSessionRepository) {}

  async start(input: StartGameInput): Promise<GameState> {
    const state = createInitialGameState(input);
    await this.sessions.save(state);
    return state;
  }

  async resume(sessionId: string): Promise<GameState | null> {
    return this.sessions.findById(sessionId);
  }
}
