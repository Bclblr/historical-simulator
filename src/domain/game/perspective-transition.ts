import type { HistoricalEntityId } from '@/domain/history';
import type { GameSelection } from './types';
import {
  createGamePerspective,
  switchPerspective,
  type GamePerspective,
} from './perspective';

export interface PerspectiveTransition {
  id: string;
  from: GamePerspective;
  to: GamePerspective;
  reason: string;
}

export interface CreatePerspectiveTransitionInput {
  id: string;
  current: GamePerspective;
  nextSelection: GameSelection;
  reason?: string;
  allowedInstitutionIds?: HistoricalEntityId[];
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createPerspectiveTransition(
  input: CreatePerspectiveTransitionInput,
): PerspectiveTransition {
  const next = createGamePerspective(input.nextSelection);

  if (
    input.allowedInstitutionIds &&
    !input.allowedInstitutionIds.includes(next.institutionId)
  ) {
    throw new Error('PerspectiveTransition target institution is not available.');
  }

  const switched = switchPerspective(input.current, input.nextSelection);

  if (
    switched.institutionId === input.current.institutionId &&
    switched.roleId === input.current.roleId &&
    switched.countryId === input.current.countryId
  ) {
    throw new Error('PerspectiveTransition must change the active perspective.');
  }

  return {
    id: required(input.id, 'PerspectiveTransition id'),
    from: input.current,
    to: switched,
    reason: input.reason?.trim() ?? '',
  };
}

export function applyPerspectiveTransition(
  transition: PerspectiveTransition,
): GamePerspective {
  return transition.to;
}

export function getPerspectiveTransitionsForInstitution(
  transitions: PerspectiveTransition[],
  institutionId: HistoricalEntityId,
): PerspectiveTransition[] {
  return transitions.filter(
    (transition) =>
      transition.from.institutionId === institutionId ||
      transition.to.institutionId === institutionId,
  );
}
