import type { DecisionEffect } from '@/domain/game';

const change = (key: string, delta: number): DecisionEffect => ({
  type: 'CHANGE_VARIABLE',
  key,
  delta,
});

const flag = (key: string): DecisionEffect => ({
  type: 'SET_FLAG',
  key,
  value: true,
});

export interface MediterraneanDelayedConsequence {
  idSuffix: string;
  delayDays: number;
  effects: DecisionEffect[];
}

/**
 * Reigns-style callbacks: important choices leave a trace that can surface
 * later as a new conversation. The delayed effect only sets memory flags and
 * small state changes; the actual narrative is supplied by memory-cards.ts.
 */
export function getMediterraneanDelayedConsequence(
  eventId: string,
  choiceId: string,
): MediterraneanDelayedConsequence | null {
  const key = `${eventId}:${choiceId}`;

  const map: Record<string, MediterraneanDelayedConsequence> = {
    'med-opening:follow-rumor': {
      idSuffix: 'rumor-return',
      delayDays: 120,
      effects: [flag('memory_rumor_returned'), change('information', 2)],
    },
    'med-opening:follow-route': {
      idSuffix: 'route-return',
      delayDays: 150,
      effects: [flag('memory_route_returned'), change('sailorNetwork', 2)],
    },
    'med-hidden-letter:carry-letter': {
      idSuffix: 'letter-return',
      delayDays: 150,
      effects: [flag('memory_letter_returned'), change('information', 2)],
    },
    'med-contact-reward:take-payment': {
      idSuffix: 'payment-return',
      delayDays: 140,
      effects: [flag('memory_payment_returned'), change('reputation', -1)],
    },
    'med-merchant-contact:carry-message': {
      idSuffix: 'trade-return',
      delayDays: 180,
      effects: [flag('memory_trade_returned'), change('merchantNetwork', 2)],
    },
    'med-port-sailor:join-crew': {
      idSuffix: 'crew-return',
      delayDays: 190,
      effects: [flag('memory_crew_returned'), change('sailorNetwork', 2)],
    },
    'med-new-identity:build-new': {
      idSuffix: 'identity-return',
      delayDays: 220,
      effects: [flag('memory_identity_returned'), change('social', 1)],
    },
    'med-family-letter:send-money': {
      idSuffix: 'family-return',
      delayDays: 170,
      effects: [flag('memory_family_returned'), change('familyTies', 1)],
    },
    'med-trader-credit:take-credit': {
      idSuffix: 'trade-credit-return',
      delayDays: 200,
      effects: [flag('memory_trade_returned'), change('debt', 2)],
    },
    'med-debt-call:roll-debt': {
      idSuffix: 'trade-debt-return',
      delayDays: 180,
      effects: [flag('memory_trade_returned'), change('debt', 2)],
    },
  };

  return map[key] ?? null;
}
