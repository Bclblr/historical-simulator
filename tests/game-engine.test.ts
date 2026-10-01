import assert from 'node:assert/strict';
import test from 'node:test';

import { GERMANY_1933_CHRONOLOGY, GERMANY_1933_EVENT_CONNECTIONS } from '../src/content/germany-1933';
import {
  createInitialGameState,
  evaluateEventEligibility,
  getNextEligibleEvent,
  matchesEventCondition,
  setGameFlag,
} from '../src/domain/game';

const baseState = createInitialGameState({
  sessionId: 'test-session',
  startDate: '1933-01-30',
  selection: {
    eraId: '1933',
    countryId: 'germany',
    institutionId: 'reich-government',
    roleId: 'reich-government-cabinet-official',
  },
});

test('event engine selects a published event that has started', () => {
  const next = getNextEligibleEvent(GERMANY_1933_CHRONOLOGY, baseState);
  assert.ok(next);
  assert.ok(next.startDate <= baseState.currentDate);
  assert.equal(evaluateEventEligibility(next, baseState).eligible, true);
});

test('event engine rejects events before their start date', () => {
  const future = GERMANY_1933_CHRONOLOGY.find(
    (event) => event.startDate > baseState.currentDate,
  );
  assert.ok(future);
  const result = evaluateEventEligibility(future, baseState);
  assert.equal(result.eligible, false);
  assert.ok(result.reasons.includes('NOT_STARTED'));
});

test('flag conditions change deterministically', () => {
  const condition = { type: 'FLAG', key: 'reviewed', expected: true } as const;
  assert.equal(matchesEventCondition(baseState, condition, { decisionHistory: [] }), false);
  const changed = setGameFlag(baseState, 'reviewed', true);
  assert.equal(matchesEventCondition(changed, condition, { decisionHistory: [] }), true);
});

test('Germany 1933 content has unique event ids and valid connections', () => {
  assert.equal(GERMANY_1933_CHRONOLOGY.length, 50);
  const ids = new Set(GERMANY_1933_CHRONOLOGY.map((event) => event.id));
  assert.equal(ids.size, GERMANY_1933_CHRONOLOGY.length);
  for (const connection of GERMANY_1933_EVENT_CONNECTIONS) {
    assert.ok(ids.has(connection.sourceEventId));
    assert.ok(ids.has(connection.targetEventId));
    assert.notEqual(connection.sourceEventId, connection.targetEventId);
  }
});
