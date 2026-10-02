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
                money: input.selection.roleId === 'med-trader' ? 55 : 50,
                safety: input.selection.roleId === 'med-sailor' ? 48 : 55,
                social: 50,
                reputation: 50,
                familyTies: 50,
                merchantNetwork: input.selection.roleId === 'med-trader' ? 4 : 0,
                sailorNetwork: input.selection.roleId === 'med-sailor' ? 4 : 0,
                intelligenceNetwork: input.selection.roleId === 'med-interpreter' ? 2 : 0,
                portReputation: input.selection.roleId === 'med-port-worker' ? 3 : 0,
                shipTrust: input.selection.roleId === 'med-sailor' ? 2 : 0,
                information: input.selection.roleId === 'med-interpreter' ? 3 : 0,
                language: input.selection.roleId === 'med-interpreter' ? 4 : 0,
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
