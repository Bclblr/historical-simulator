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
      state: createInitialGameState({
        ...input,
        variables: input.campaign
          ? input.campaign.campaignId === 'germany-life'
            ? {
                money: 50,
                safety: 55,
                social: 50,
                reputation: 50,
              }
            : input.campaign.campaignId === 'ottoman-mediterranean'
            ? {
                money: 50,
                safety: 55,
                social: 50,
                reputation: 50,
                familyTies: 50,
                merchantNetwork: 0,
                sailorNetwork: 0,
                intelligenceNetwork: 0,
                portReputation: 0,
                shipTrust: 0,
                information: 0,
                language: 0,
                debt: 0,
              }
            : {
                publicSupport: 55,
                institutionalInfluence: 55,
                stability: 50,
                foreignRelations: 50,
              }
          : undefined,
      }),
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
