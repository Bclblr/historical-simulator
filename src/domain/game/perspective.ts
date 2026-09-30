import type { HistoricalEntityId } from '@/domain/history';
import type { GameSelection } from './types';
import {
  canInstitutionAccessInformation,
  type InformationAccessRule,
} from './information-visibility';
import {
  getInformationAssessment,
  type InformationAssessment,
} from './information-reliability';

export interface GamePerspective {
  eraId: HistoricalEntityId;
  countryId: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  roleId: HistoricalEntityId;
}

export interface PerspectiveInformation {
  subjectId: HistoricalEntityId;
  accessible: boolean;
  assessment: InformationAssessment | null;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createGamePerspective(
  selection: GameSelection,
): GamePerspective {
  return {
    eraId: required(selection.eraId, 'GamePerspective eraId'),
    countryId: required(selection.countryId, 'GamePerspective countryId'),
    institutionId: required(
      selection.institutionId,
      'GamePerspective institutionId',
    ),
    roleId: required(selection.roleId, 'GamePerspective roleId'),
  };
}

export function inspectInformationFromPerspective(
  perspective: GamePerspective,
  subjectId: HistoricalEntityId,
  accessRules: InformationAccessRule[],
  assessments: InformationAssessment[],
): PerspectiveInformation {
  const rule =
    accessRules.find((candidate) => candidate.subjectId === subjectId) ?? null;
  const accessible = rule
    ? canInstitutionAccessInformation(rule, perspective.institutionId)
    : true;

  return {
    subjectId,
    accessible,
    assessment: accessible
      ? getInformationAssessment(
          assessments,
          subjectId,
          perspective.institutionId,
        )
      : null,
  };
}

export function switchPerspective(
  current: GamePerspective,
  selection: GameSelection,
): GamePerspective {
  const next = createGamePerspective(selection);

  if (next.eraId !== current.eraId) {
    throw new Error(
      'GamePerspective cannot switch eras inside the same simulation session.',
    );
  }

  return next;
}
