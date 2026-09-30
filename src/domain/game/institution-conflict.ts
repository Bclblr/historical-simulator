import type { HistoricalEntityId } from '@/domain/history';

export type InstitutionConflictStatus = 'ACTIVE' | 'RESOLVED';
export type InstitutionConflictIntensity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface InstitutionConflict {
  id: string;
  institutionIds: [HistoricalEntityId, HistoricalEntityId];
  subject: string;
  intensity: InstitutionConflictIntensity;
  status: InstitutionConflictStatus;
  note: string;
}

export interface CreateInstitutionConflictInput {
  id: string;
  institutionIds: [HistoricalEntityId, HistoricalEntityId];
  subject: string;
  intensity?: InstitutionConflictIntensity;
  status?: InstitutionConflictStatus;
  note?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createInstitutionConflict(
  input: CreateInstitutionConflictInput,
): InstitutionConflict {
  const first = required(input.institutionIds[0], 'InstitutionConflict institutionIds[0]');
  const second = required(input.institutionIds[1], 'InstitutionConflict institutionIds[1]');

  if (first === second) {
    throw new Error('InstitutionConflict must involve two different institutions.');
  }

  return {
    id: required(input.id, 'InstitutionConflict id'),
    institutionIds: [first, second],
    subject: required(input.subject, 'InstitutionConflict subject'),
    intensity: input.intensity ?? 'LOW',
    status: input.status ?? 'ACTIVE',
    note: input.note?.trim() ?? '',
  };
}

export function resolveInstitutionConflict(
  conflict: InstitutionConflict,
): InstitutionConflict {
  return { ...conflict, status: 'RESOLVED' };
}

export function setInstitutionConflictIntensity(
  conflict: InstitutionConflict,
  intensity: InstitutionConflictIntensity,
): InstitutionConflict {
  return { ...conflict, intensity };
}

export function getActiveInstitutionConflicts(
  conflicts: InstitutionConflict[],
  institutionId: HistoricalEntityId,
): InstitutionConflict[] {
  return conflicts.filter(
    (conflict) =>
      conflict.status === 'ACTIVE' &&
      conflict.institutionIds.includes(institutionId),
  );
}
