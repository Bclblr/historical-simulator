import type { HistoricalEntityId } from './types';

export type InstitutionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type InstitutionType =
  | 'EXECUTIVE'
  | 'LEGISLATIVE'
  | 'JUDICIAL'
  | 'MILITARY'
  | 'SECURITY'
  | 'DIPLOMATIC'
  | 'ADMINISTRATIVE'
  | 'POLITICAL'
  | 'ECONOMIC'
  | 'OTHER';

export interface Institution {
  id: HistoricalEntityId;
  countryId: HistoricalEntityId;
  parentInstitutionId: HistoricalEntityId | null;
  name: string;
  shortName: string;
  description: string;
  type: InstitutionType;
  sortOrder: number;
  status: InstitutionStatus;
}

export interface CreateInstitutionInput {
  id: HistoricalEntityId;
  countryId: HistoricalEntityId;
  parentInstitutionId?: HistoricalEntityId | null;
  name: string;
  shortName?: string;
  description?: string;
  type?: InstitutionType;
  sortOrder?: number;
  status?: InstitutionStatus;
}

export function createInstitution(input: CreateInstitutionInput): Institution {
  const id = input.id.trim();
  const countryId = input.countryId.trim();
  const parentInstitutionId = input.parentInstitutionId?.trim() || null;
  const name = input.name.trim();
  const shortName = input.shortName?.trim() || name;
  const description = input.description?.trim() ?? '';
  const sortOrder = input.sortOrder ?? 0;

  if (!id) throw new Error('Institution id is required.');
  if (!countryId) throw new Error('Institution countryId is required.');
  if (!name) throw new Error('Institution name is required.');
  if (parentInstitutionId === id) {
    throw new Error('Institution cannot be its own parent.');
  }
  if (!Number.isInteger(sortOrder)) {
    throw new Error('Institution sortOrder must be an integer.');
  }

  return {
    id,
    countryId,
    parentInstitutionId,
    name,
    shortName,
    description,
    type: input.type ?? 'OTHER',
    sortOrder,
    status: input.status ?? 'DRAFT',
  };
}
