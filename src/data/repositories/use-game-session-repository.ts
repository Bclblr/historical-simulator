import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';

import { SQLiteGameSessionRepository } from './sqlite-game-session-repository';

export function useGameSessionRepository(): SQLiteGameSessionRepository {
  const db = useSQLiteContext();
  return useMemo(() => new SQLiteGameSessionRepository(db), [db]);
}
