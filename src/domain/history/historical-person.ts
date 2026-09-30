import type { HistoricalEntityId } from './types';

export type HistoricalPersonStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface HistoricalPerson {
  id: HistoricalEntityId;
  name: string;
  shortName: string;
  biography: string;
  birthDate: string | null;
  deathDate: string | null;
  sortOrder: number;
  status: HistoricalPersonStatus;
}

export interface HistoricalRoleTenure {
  id: HistoricalEntityId;
  personId: HistoricalEntityId;
  roleId: HistoricalEntityId;
  startDate: string;
  endDate: string | null;
}

export interface CreateHistoricalPersonInput {
  id: HistoricalEntityId;
  name: string;
  shortName?: string;
  biography?: string;
  birthDate?: string | null;
  deathDate?: string | null;
  sortOrder?: number;
  status?: HistoricalPersonStatus;
}

export interface CreateHistoricalRoleTenureInput {
  id: HistoricalEntityId;
  personId: HistoricalEntityId;
  roleId: HistoricalEntityId;
  startDate: string;
  endDate?: string | null;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertIsoDate(value: string, field: string): void {
  if (!ISO_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${field} must be a valid ISO date (YYYY-MM-DD).`);
  }
}

export function createHistoricalPerson(input: CreateHistoricalPersonInput): HistoricalPerson {
  const id = input.id.trim();
  const name = input.name.trim();
  const shortName = input.shortName?.trim() || name;
  const biography = input.biography?.trim() ?? '';
  const birthDate = input.birthDate ?? null;
  const deathDate = input.deathDate ?? null;
  const sortOrder = input.sortOrder ?? 0;

  if (!id) throw new Error('HistoricalPerson id is required.');
  if (!name) throw new Error('HistoricalPerson name is required.');
  if (birthDate) assertIsoDate(birthDate, 'HistoricalPerson birthDate');
  if (deathDate) assertIsoDate(deathDate, 'HistoricalPerson deathDate');
  if (birthDate && deathDate && birthDate > deathDate) {
    throw new Error('HistoricalPerson birthDate cannot be after deathDate.');
  }
  if (!Number.isInteger(sortOrder)) {
    throw new Error('HistoricalPerson sortOrder must be an integer.');
  }

  return { id, name, shortName, biography, birthDate, deathDate, sortOrder, status: input.status ?? 'DRAFT' };
}

export function createHistoricalRoleTenure(input: CreateHistoricalRoleTenureInput): HistoricalRoleTenure {
  const id = input.id.trim();
  const personId = input.personId.trim();
  const roleId = input.roleId.trim();
  const endDate = input.endDate ?? null;

  if (!id) throw new Error('HistoricalRoleTenure id is required.');
  if (!personId) throw new Error('HistoricalRoleTenure personId is required.');
  if (!roleId) throw new Error('HistoricalRoleTenure roleId is required.');
  assertIsoDate(input.startDate, 'HistoricalRoleTenure startDate');
  if (endDate) assertIsoDate(endDate, 'HistoricalRoleTenure endDate');
  if (endDate && input.startDate > endDate) {
    throw new Error('HistoricalRoleTenure startDate cannot be after endDate.');
  }

  return { id, personId, roleId, startDate: input.startDate, endDate };
}
