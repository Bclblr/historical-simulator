import type { SQLiteDatabase } from 'expo-sqlite';

export const migration002 = {
  version: 2,
  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      ALTER TABLE game_sessions
        ADD COLUMN decision_history_json TEXT NOT NULL DEFAULT '[]';

      ALTER TABLE game_sessions
        ADD COLUMN scheduled_effects_json TEXT NOT NULL DEFAULT '[]';
    `);
  },
} as const;
