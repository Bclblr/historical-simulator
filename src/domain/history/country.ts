import type { HistoricalEntityId } from './types';

export type CountryStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Country {
  id: HistoricalEntityId;
  eraId: HistoricalEntityId;
  name: string;
  shortName: string;
  description: string;
  sortOrder: number;
  status: CountryStatus;
}

export interface CreateCountryInput {
  id: HistoricalEntityId;
  eraId: HistoricalEntityId;
  name: string;
  shortName?: string;
  description?: string;
  sortOrder?: number;
  status?: CountryStatus;
}

export function createCountry(input: CreateCountryInput): Country {
  const id = input.id.trim();
  const eraId = input.eraId.trim();
  const name = input.name.trim();
  const shortName = input.shortName?.trim() || name;
  const description = input.description?.trim() ?? '';
  const sortOrder = input.sortOrder ?? 0;

  if (!id) throw new Error('Country id is required.');
  if (!eraId) throw new Error('Country eraId is required.');
  if (!name) throw new Error('Country name is required.');
  if (!Number.isInteger(sortOrder)) {
    throw new Error('Country sortOrder must be an integer.');
  }

  return {
    id,
    eraId,
    name,
    shortName,
    description,
    sortOrder,
    status: input.status ?? 'DRAFT',
  };
}
