import type { HistoricalEntityId } from './types';

export type HistoricalRoleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type HistoricalRoleType =
  | 'HEAD_OF_STATE'
  | 'HEAD_OF_GOVERNMENT'
  | 'MINISTERIAL'
  | 'LEGISLATIVE'
  | 'JUDICIAL'
  | 'MILITARY'
  | 'DIPLOMATIC'
  | 'ADMINISTRATIVE'
  | 'POLITICAL'
  | 'ADVISORY'
  | 'OTHER';

export interface HistoricalRole {
  id: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  parentRoleId: HistoricalEntityId | null;
  name: string;
  shortName: string;
  description: string;
  type: HistoricalRoleType;
  sortOrder: number;
  status: HistoricalRoleStatus;
}

export interface CreateHistoricalRoleInput {
  id: HistoricalEntityId;
  institutionId: HistoricalEntityId;
  parentRoleId?: HistoricalEntityId | null;
  name: string;
  shortName?: string;
  description?: string;
  type?: HistoricalRoleType;
  sortOrder?: number;
  status?: HistoricalRoleStatus;
}

export function createHistoricalRole(input: CreateHistoricalRoleInput): HistoricalRole {
  const id = input.id.trim();
  const institutionId = input.institutionId.trim();
  const parentRoleId = input.parentRoleId?.trim() || null;
  const name = input.name.trim();
  const shortName = input.shortName?.trim() || name;
  const description = input.description?.trim() ?? '';
  const sortOrder = input.sortOrder ?? 0;

  if (!id) throw new Error('HistoricalRole id is required.');
  if (!institutionId) throw new Error('HistoricalRole institutionId is required.');
  if (!name) throw new Error('HistoricalRole name is required.');
  if (parentRoleId === id) {
    throw new Error('HistoricalRole cannot be its own parent.');
  }
  if (!Number.isInteger(sortOrder)) {
    throw new Error('HistoricalRole sortOrder must be an integer.');
  }

  return {
    id,
    institutionId,
    parentRoleId,
    name,
    shortName,
    description,
    type: input.type ?? 'OTHER',
    sortOrder,
    status: input.status ?? 'DRAFT',
  };
}
