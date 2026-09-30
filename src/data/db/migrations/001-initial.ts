import type { SQLiteDatabase } from 'expo-sqlite';

export const migration001 = {
  version: 1,
  async up(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS eras (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        start_year INTEGER NOT NULL,
        end_year INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS countries (
        id TEXT PRIMARY KEY NOT NULL,
        era_id TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (era_id) REFERENCES eras(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS institutions (
        id TEXT PRIMARY KEY NOT NULL,
        country_id TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS historical_roles (
        id TEXT PRIMARY KEY NOT NULL,
        institution_id TEXT NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS game_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        current_date TEXT NOT NULL,
        era_id TEXT NOT NULL,
        country_id TEXT NOT NULL,
        institution_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        flags_json TEXT NOT NULL DEFAULT '{}',
        variables_json TEXT NOT NULL DEFAULT '{}',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_countries_era_id ON countries(era_id);
      CREATE INDEX IF NOT EXISTS idx_institutions_country_id ON institutions(country_id);
      CREATE INDEX IF NOT EXISTS idx_roles_institution_id ON historical_roles(institution_id);
      CREATE INDEX IF NOT EXISTS idx_game_sessions_updated_at ON game_sessions(updated_at);
    `);
  },
} as const;
