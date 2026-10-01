import type {
  DecisionRecord,
  GameSessionSnapshot,
  GameState,
  ScheduledDecisionEffect,
} from '@/domain/game';

export interface GameSessionRowData {
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

function parseRecord(
  value: string,
  kind: 'flags' | 'variables',
): Record<string, boolean | number> {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`Invalid ${kind} payload in saved game.`);
  }
  const entries = Object.entries(parsed);
  const valid =
    kind === 'flags'
      ? entries.every(([, item]) => typeof item === 'boolean')
      : entries.every(
          ([, item]) => typeof item === 'number' && Number.isFinite(item),
        );
  if (!valid) throw new Error(`Invalid ${kind} value in saved game.`);
  return Object.fromEntries(entries);
}

function parseDecisionHistory(value: string): DecisionRecord[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid decision history payload in saved game.');
  }
  for (const item of parsed) {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid decision history item.');
    }
    const record = item as Partial<DecisionRecord>;
    if (
      typeof record.eventId !== 'string' ||
      typeof record.optionId !== 'string' ||
      typeof record.decidedAt !== 'string' ||
      !Number.isInteger(record.sequence)
    ) {
      throw new Error('Invalid decision history item.');
    }
  }
  return parsed as DecisionRecord[];
}

function parseScheduledEffects(value: string): ScheduledDecisionEffect[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid scheduled effects payload in saved game.');
  }
  for (const item of parsed) {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid scheduled effect item.');
    }
    const effect = item as Partial<ScheduledDecisionEffect>;
    if (
      typeof effect.id !== 'string' ||
      typeof effect.dueDate !== 'string' ||
      !Array.isArray(effect.effects) ||
      !Number.isInteger(effect.sequence)
    ) {
      throw new Error('Invalid scheduled effect item.');
    }
  }
  return parsed as ScheduledDecisionEffect[];
}

export function decodeGameSessionRow(
  row: GameSessionRowData,
): GameSessionSnapshot {
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
    variables: parseRecord(row.variables_json, 'variables') as Record<
      string,
      number
    >,
  };
  return {
    state,
    decisionHistory: parseDecisionHistory(row.decision_history_json),
    scheduledEffects: parseScheduledEffects(row.scheduled_effects_json),
  };
}
