import type { SQLiteDatabase } from 'expo-sqlite';

import type {
  DecisionRecord,
  GameSessionId,
  GameSessionSnapshot,
  GameState,
  ScheduledDecisionEffect,
} from '@/domain/game';
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
  decision_history_json: string;
  scheduled_effects_json: string;
}

function parseRecord(value: string, kind: 'flags' | 'variables'): Record<string, boolean | number> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Invalid ${kind} payload in saved game.`);
  }
  const entries = Object.entries(parsed);
  const valid = kind === 'flags'
    ? entries.every(([, item]) => typeof item === 'boolean')
    : entries.every(([, item]) => typeof item === 'number' && Number.isFinite(item));
  if (!valid) throw new Error(`Invalid ${kind} value in saved game.`);
  return Object.fromEntries(entries);
}

function parseDecisionHistory(value: string): DecisionRecord[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error('Invalid decision history payload in saved game.');
  for (const item of parsed) {
    if (!item || typeof item !== 'object') throw new Error('Invalid decision history item.');
    const record = item as Partial<DecisionRecord>;
    if (
      typeof record.eventId !== 'string' ||
      typeof record.optionId !== 'string' ||
      typeof record.decidedAt !== 'string' ||
      !Number.isInteger(record.sequence)
    ) throw new Error('Invalid decision history item.');
  }
  return parsed as DecisionRecord[];
}

function parseScheduledEffects(value: string): ScheduledDecisionEffect[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error('Invalid scheduled effects payload in saved game.');
  for (const item of parsed) {
    if (!item || typeof item !== 'object') throw new Error('Invalid scheduled effect item.');
    const effect = item as Partial<ScheduledDecisionEffect>;
    if (
      typeof effect.id !== 'string' ||
      typeof effect.dueDate !== 'string' ||
      !Array.isArray(effect.effects) ||
      !Number.isInteger(effect.sequence)
    ) throw new Error('Invalid scheduled effect item.');
  }
  return parsed as ScheduledDecisionEffect[];
}

function rowToSnapshot(row: GameSessionRow): GameSessionSnapshot {
  const state: GameState = {
    sessionId: row.id,
    currentDate: row.current_date,
    selection: {
      eraId: row.era_id,
      countryId: row.country_id,
      institutionId: row.institution_id,
      roleId: row.role_id,
    },
    flags: parseRecord(row.flags_json, 'flags') as Record<string, boolean>,
    variables: parseRecord(row.variables_json, 'variables') as Record<string, number>,
  };
  return {
    state,
    decisionHistory: parseDecisionHistory(row.decision_history_json),
    scheduledEffects: parseScheduledEffects(row.scheduled_effects_json),
  };
}

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
    return row ? rowToSnapshot(row) : null;
  }

  async findMostRecent(): Promise<GameSessionSnapshot | null> {
    const row = await this.db.getFirstAsync<GameSessionRow>(
      `SELECT ${SELECT_COLUMNS} FROM game_sessions ORDER BY updated_at DESC LIMIT 1`,
    );
    return row ? rowToSnapshot(row) : null;
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
