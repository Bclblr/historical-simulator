import { useMemo } from 'react';
import { useGameSessionRepository } from '@/data/repositories';
import { GameSessionService } from './game-session-service';

export function useGameSessionService(): GameSessionService {
  const repository = useGameSessionRepository();
  return useMemo(() => new GameSessionService(repository), [repository]);
}
