import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ALL_MEDITERRANEAN_CARDS,
  HISTORICAL_CONTEXT_CARDS,
  REIGNS_SCALE_CARDS,
  EXPANDED_MEDITERRANEAN_CARDS,
  EXTRA_MEDITERRANEAN_CARDS,
  validateMediterraneanContent,
} from '../src/content/ottoman-mediterranean/deck';
import { MEDITERRANEAN_MEMORY_CARDS } from '../src/content/ottoman-mediterranean/memory-cards';
import { getMediterraneanDelayedConsequence } from '../src/content/ottoman-mediterranean/consequences';

test('Mediterranean deck has unique ids and valid date ranges', () => {
  const ids = new Set(ALL_MEDITERRANEAN_CARDS.map((card) => card.id));
  assert.equal(ids.size, ALL_MEDITERRANEAN_CARDS.length);
  assert.deepEqual(validateMediterraneanContent(), []);
});

test('Mediterranean generated card families keep their expected sizes', () => {
  assert.equal(REIGNS_SCALE_CARDS.length, 625);
  assert.equal(EXPANDED_MEDITERRANEAN_CARDS.length, 180);
  assert.equal(EXTRA_MEDITERRANEAN_CARDS.length, 300);
  assert.equal(HISTORICAL_CONTEXT_CARDS.length, 120);
});

test('every choice exposes at least one effect', () => {
  for (const card of ALL_MEDITERRANEAN_CARDS) {
    assert.ok(card.left.effects.length, card.id);
    assert.ok(card.right.effects.length, card.id);
  }
});

test('important Mediterranean choices schedule a later narrative callback', () => {
  const cases = [
    ['med-opening', 'follow-rumor'],
    ['med-opening', 'follow-route'],
    ['med-hidden-letter', 'carry-letter'],
    ['med-contact-reward', 'take-payment'],
    ['med-merchant-contact', 'carry-message'],
    ['med-port-sailor', 'join-crew'],
    ['med-new-identity', 'build-new'],
  ] as const;

  for (const [eventId, choiceId] of cases) {
    const consequence = getMediterraneanDelayedConsequence(eventId, choiceId);
    assert.ok(consequence);
    assert.ok(consequence.delayDays > 0);
    assert.ok(consequence.effects.length > 0);
  }
});

test('every recurring memory card has a flag that can be scheduled by the consequence system', () => {
  const scheduledFlags = new Set<string>();
  const cases = [
    ['med-opening', 'follow-rumor'],
    ['med-opening', 'follow-route'],
    ['med-hidden-letter', 'carry-letter'],
    ['med-contact-reward', 'take-payment'],
    ['med-merchant-contact', 'carry-message'],
    ['med-port-sailor', 'join-crew'],
    ['med-new-identity', 'build-new'],
    ['med-family-letter', 'send-money'],
  ] as const;

  for (const [eventId, choiceId] of cases) {
    const consequence = getMediterraneanDelayedConsequence(eventId, choiceId);
    for (const effect of consequence?.effects ?? []) {
      if (effect.type === 'SET_FLAG') scheduledFlags.add(effect.key);
    }
  }

  for (const card of MEDITERRANEAN_MEMORY_CARDS) {
    const required = Object.keys(card.requires ?? {});
    assert.equal(required.length, 1);
    assert.ok(scheduledFlags.has(required[0]), card.id);
  }
});
