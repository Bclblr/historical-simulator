import assert from 'node:assert/strict';
import test from 'node:test';

import { decodeGameSessionRow, type GameSessionRowData } from '../src/data/repositories/game-session-codec';

function validRow(): GameSessionRowData {
  return {
    id: 'save-1',
    current_date: '1933-01-30',
    era_id: '1933',
    country_id: 'germany',
    institution_id: 'reich-government',
    role_id: 'reich-government-cabinet-official',
    flags_json: '{"reviewed":true}',
    variables_json: '{"influence":10}',
    decision_history_json: '[]',
    scheduled_effects_json: '[]',
  };
}

test('valid save row decodes without changing state', () => {
  const snapshot = decodeGameSessionRow(validRow());
  assert.equal(snapshot.state.sessionId, 'save-1');
  assert.equal(snapshot.state.flags.reviewed, true);
  assert.equal(snapshot.state.variables.influence, 10);
});

test('corrupt JSON is rejected instead of silently loading', () => {
  const row = validRow();
  row.flags_json = '{broken';
  assert.throws(() => decodeGameSessionRow(row));
});

test('invalid save value types are rejected', () => {
  const row = validRow();
  row.variables_json = '{"influence":"high"}';
  assert.throws(
    () => decodeGameSessionRow(row),
    /Invalid variables value in saved game/,
  );
});

test('missing legacy arrays can be migrated to empty arrays before decoding', () => {
  const legacy = {
    ...validRow(),
    decision_history_json: '[]',
    scheduled_effects_json: '[]',
  };
  const snapshot = decodeGameSessionRow(legacy);
  assert.deepEqual(snapshot.decisionHistory, []);
  assert.deepEqual(snapshot.scheduledEffects, []);
});
