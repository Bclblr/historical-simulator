import type { SQLiteDatabase } from 'expo-sqlite';

import type { GameSessionId, GameState } from '@/domain/game';
import type { GameSessionRepository } from './game-session-repository';

interface GameSessionRow {
  id: string;
  current_date: string;
  era_id: string;
  country_id: string;
  institution_id: string;
  role_id: string;
  flags_json: string;
  variables_json: string;
}

function parseBooleanRecord(value: string): Record<string, boolean> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid flags payload in saved game.');
  }

  const entries = Object.entries(parsed);
  if (entries.some(([, item]) => typeof item !== 'boolean')) {
    throw new Error('Invalid flag value in saved game.');
  }

  return Object.fromEntries(entries) as Record<string, boolean>;
}

function parseNumberRecord(value: string): Record<string, number> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid variables payload in saved game.');
  }

  const entries = Object.entries(parsed);
  if (entries.some(([, item]) => typeof item !== 'number' || !Number.isFinite(item))) {
    throw new Error('Invalid variable value in saved game.');
  }

  return Object.fromEntries(entries) as Record<string, number>;
}

function rowToState(row: GameSessionRow): GameState {
  return {
    sessionId: row.id,
    currentDate: row.current_date,
    selection: {
      eraId: row.era_id,
      countryId: row.country_id,
      institutionId: row.institution_id,
      roleId: row.role_id,
    },
    flags: parseBooleanRecord(row.flags_json),
    variables: parseNumberRecord(row.variables_json),
  };
}

export class SQLiteGameSessionRepository implements GameSessionRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async findById(sessionId: GameSessionId): Promise<GameState | null> {
    const row = await this.db.getFirstAsync<GameSessionRow>(
      `SELECT id, current_date, era_id, country_id, institution_id, role_id, flags_json, variables_json
       FROM game_sessions
       WHERE id = ?`,
      sessionId,
    );

    return row ? rowToState(row) : null;
  }

  async findMostRecent(): Promise<GameState | null> {
    const row = await this.db.getFirstAsync<GameSessionRow>(
      `SELECT id, current_date, era_id, country_id, institution_id, role_id, flags_json, variables_json
       FROM game_sessions
       ORDER BY updated_at DESC
       LIMIT 1`,
    );

    return row ? rowToState(row) : null;
  }

  async save(state: GameState): Promise<void> {
    const now = new Date().toISOString();

    await this.db.runAsync(
      `INSERT INTO game_sessions (
        id, current_date, era_id, country_id, institution_id, role_id,
        flags_json, variables_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        current_date = excluded.current_date,
        era_id = excluded.era_id,
        country_id = excluded.country_id,
        institution_id = excluded.institution_id,
        role_id = excluded.role_id,
        flags_json = excluded.flags_json,
        variables_json = excluded.variables_json,
        updated_at = excluded.updated_at`,
      state.sessionId,
      state.currentDate,
      state.selection.eraId,
      state.selection.countryId,
      state.selection.institutionId,
      state.selection.roleId,
      JSON.stringify(state.flags),
      JSON.stringify(state.variables),
      now,
      now,
    );
  }
}
