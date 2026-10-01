import type { DecisionEffect } from '@/domain/game';

export interface ScenarioDelayedConsequence {
  idSuffix: string;
  delayDays: number;
  effects: DecisionEffect[];
}

export function getGermany1933DelayedConsequence(
  eventId: string,
  choiceIdSuffix: string,
): ScenarioDelayedConsequence | null {
  const cautious = choiceIdSuffix.includes('review') || choiceIdSuffix.includes('analysis') || choiceIdSuffix.includes('document');
  const procedural = choiceIdSuffix.includes('proceed') || choiceIdSuffix.includes('forward') || choiceIdSuffix.includes('routine') || choiceIdSuffix.includes('prepare') || choiceIdSuffix.includes('expedite');

  if (cautious) {
    return {
      idSuffix: `${eventId}:${choiceIdSuffix}:follow-up`,
      delayDays: 14,
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: 1 },
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: -1 },
      ],
    };
  }

  if (procedural) {
    return {
      idSuffix: `${eventId}:${choiceIdSuffix}:follow-up`,
      delayDays: 14,
      effects: [
        { type: 'CHANGE_VARIABLE', key: 'stability', delta: 1 },
        { type: 'CHANGE_VARIABLE', key: 'institutionalInfluence', delta: -1 },
      ],
    };
  }

  return null;
}
