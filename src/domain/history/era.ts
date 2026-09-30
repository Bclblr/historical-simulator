import type { HistoricalEntityId } from './types';

export type EraStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Era {
  id: HistoricalEntityId;
  name: string;
  shortName: string;
  description: string;
  startDate: string;
  endDate: string;
  startYear: number;
  endYear: number;
  sortOrder: number;
  status: EraStatus;
}

export interface CreateEraInput {
  id: HistoricalEntityId;
  name: string;
  shortName?: string;
  description?: string;
  startDate: string;
  endDate: string;
  sortOrder?: number;
  status?: EraStatus;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertIsoDate(value: string, field: string): void {
  if (!ISO_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${field} must be a valid ISO date (YYYY-MM-DD).`);
  }
}

export function createEra(input: CreateEraInput): Era {
  const id = input.id.trim();
  const name = input.name.trim();
  const shortName = input.shortName?.trim() || name;
  const description = input.description?.trim() ?? '';

  if (!id) throw new Error('Era id is required.');
  if (!name) throw new Error('Era name is required.');

  assertIsoDate(input.startDate, 'Era startDate');
  assertIsoDate(input.endDate, 'Era endDate');

  if (input.startDate > input.endDate) {
    throw new Error('Era startDate cannot be after endDate.');
  }

  const sortOrder = input.sortOrder ?? 0;
  if (!Number.isInteger(sortOrder)) {
    throw new Error('Era sortOrder must be an integer.');
  }

  return {
    id,
    name,
    shortName,
    description,
    startDate: input.startDate,
    endDate: input.endDate,
    startYear: Number(input.startDate.slice(0, 4)),
    endYear: Number(input.endDate.slice(0, 4)),
    sortOrder,
    status: input.status ?? 'DRAFT',
  };
}

export function eraContainsDate(era: Era, date: string): boolean {
  assertIsoDate(date, 'date');
  return date >= era.startDate && date <= era.endDate;
}
