import {
  createInitialGameState,
  type CampaignProfile,
  type GameSelection,
  type GameSessionSnapshot,
} from '@/domain/game';
import type { GameSessionRepository } from '@/data/repositories';

export interface StartGameInput {
  sessionId: string;
  startDate: string;
  selection: GameSelection;
  campaign?: CampaignProfile;
}

export class GameSessionService {
  constructor(private readonly sessions: GameSessionRepository) {}

  async start(input: StartGameInput): Promise<GameSessionSnapshot> {
    const snapshot: GameSessionSnapshot = {
      state: createInitialGameState(input),
      campaign: input.campaign,
      decisionHistory: [],
      scheduledEffects: [],
    };
    await this.sessions.save(snapshot);
    return snapshot;
  }

  async resume(sessionId: string): Promise<GameSessionSnapshot | null> {
    return this.sessions.findById(sessionId);
  }

  async resumeMostRecent(): Promise<GameSessionSnapshot | null> {
    return this.sessions.findMostRecent();
  }

  async save(snapshot: GameSessionSnapshot): Promise<void> {
    await this.sessions.save(snapshot);
  }
}
