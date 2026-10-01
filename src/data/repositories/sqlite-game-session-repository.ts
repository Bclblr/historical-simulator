import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  GameSessionId,
  GameSessionSnapshot,
} from '@/domain/game';
import type { GameSessionRepository } from './game-session-repository';
import { decodeGameSessionRow, type GameSessionRowData } from './game-session-codec';

type GameSessionRow = GameSessionRowData;

const SELECT_COLUMNS = `
  id, current_date, era_id, country_id, institution_id, role_id,
  flags_json, variables_json, decision_history_json, scheduled_effects_json
`;

export class SQLiteGameSessionRepository implements GameSessionRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async findById(sessionId: GameSessionId): Promise<GameSessionSnapshot | null> {
    const row = await this.db.getFirstAsync<GameSessionRow>(
      `SELECT ${SELECT_COLUMNS} FROM game_sessions WHERE id = ?`,
      sessionId,
    );
    return row ? decodeGameSessionRow(row) : null;
  }

  async findMostRecent(): Promise<GameSessionSnapshot | null> {
    const row = await this.db.getFirstAsync<GameSessionRow>(
      `SELECT ${SELECT_COLUMNS} FROM game_sessions ORDER BY updated_at DESC LIMIT 1`,
    );
    return row ? decodeGameSessionRow(row) : null;
  }

  async save(snapshot: GameSessionSnapshot): Promise<void> {
    const { state } = snapshot;
    const now = new Date().toISOString();
    await this.db.runAsync(
      `INSERT INTO game_sessions (
        id, current_date, era_id, country_id, institution_id, role_id,
        flags_json, variables_json, decision_history_json, scheduled_effects_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        current_date = excluded.current_date,
        era_id = excluded.era_id,
        country_id = excluded.country_id,
        institution_id = excluded.institution_id,
        role_id = excluded.role_id,
        flags_json = excluded.flags_json,
        variables_json = excluded.variables_json,
        decision_history_json = excluded.decision_history_json,
        scheduled_effects_json = excluded.scheduled_effects_json,
        updated_at = excluded.updated_at`,
      state.sessionId,
      state.currentDate,
      state.selection.eraId,
      state.selection.countryId,
      state.selection.institutionId,
      state.selection.roleId,
      JSON.stringify(state.flags),
      JSON.stringify(state.variables),
      JSON.stringify(snapshot.decisionHistory),
      JSON.stringify(snapshot.scheduledEffects),
      now,
      now,
    );
  }
}
