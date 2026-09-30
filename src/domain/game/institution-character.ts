import type { HistoricalEntityId } from '@/domain/history';
import type { PositionAssignment } from './position-assignment';

export type InstitutionCharacterPresence = 'AVAILABLE' | 'ABSENT' | 'UNAVAILABLE';

export interface InstitutionCharacter {
  personId: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  positionAssignmentId: string;
  presence: InstitutionCharacterPresence;
  simulationNote: string;
}

export interface CreateInstitutionCharacterInput {
  personId: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  positionAssignmentId: string;
  presence?: InstitutionCharacterPresence;
  simulationNote?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createInstitutionCharacter(
  input: CreateInstitutionCharacterInput,
  assignments: PositionAssignment[],
): InstitutionCharacter {
  const personId = required(input.personId, 'InstitutionCharacter personId');
  const institutionId = required(
    input.institutionId,
    'InstitutionCharacter institutionId',
  );
  const positionAssignmentId = required(
    input.positionAssignmentId,
    'InstitutionCharacter positionAssignmentId',
  );

  const assignment = assignments.find(
    (candidate) => candidate.id === positionAssignmentId,
  );

  if (!assignment) {
    throw new Error('InstitutionCharacter position assignment was not found.');
  }
  if (assignment.personId !== personId) {
    throw new Error('InstitutionCharacter person does not match position assignment.');
  }
  if (assignment.institutionId !== institutionId) {
    throw new Error('InstitutionCharacter institution does not match position assignment.');
  }

  return {
    personId,
    institutionId,
    positionAssignmentId,
    presence: input.presence ?? 'AVAILABLE',
    simulationNote: input.simulationNote?.trim() ?? '',
  };
}

export function setInstitutionCharacterPresence(
  character: InstitutionCharacter,
  presence: InstitutionCharacterPresence,
): InstitutionCharacter {
  return { ...character, presence };
}

export function getInstitutionCharacters(
  characters: InstitutionCharacter[],
  institutionId: HistoricalEntityId,
  presence?: InstitutionCharacterPresence,
): InstitutionCharacter[] {
  return characters.filter(
    (character) =>
      character.institutionId === institutionId &&
      (presence === undefined || character.presence === presence),
  );
}

export function getInstitutionCharacterByPerson(
  characters: InstitutionCharacter[],
  personId: HistoricalEntityId,
): InstitutionCharacter | null {
  return characters.find((character) => character.personId === personId) ?? null;
}
