import type {
  HistoricalContentClassification,
  HistoricalEntityId,
} from './types';

export type HistoricalEventStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type HistoricalEventScope =
  | 'LOCAL'
  | 'REGIONAL'
  | 'NATIONAL'
  | 'INTERNATIONAL'
  | 'GLOBAL';

export interface HistoricalEvent {
  id: HistoricalEntityId;
  eraId: HistoricalEntityId;
  countryIds: HistoricalEntityId[];
  institutionIds: HistoricalEntityId[];
  personIds: HistoricalEntityId[];
  title: string;
  summary: string;
  startDate: string;
  endDate: string | null;
  scope: HistoricalEventScope;
  classification: HistoricalContentClassification;
  sortOrder: number;
  status: HistoricalEventStatus;
}

export interface CreateHistoricalEventInput {
  id: HistoricalEntityId;
  eraId: HistoricalEntityId;
  countryIds?: HistoricalEntityId[];
  institutionIds?: HistoricalEntityId[];
  personIds?: HistoricalEntityId[];
  title: string;
  summary?: string;
  startDate: string;
  endDate?: string | null;
  scope?: HistoricalEventScope;
  classification?: HistoricalContentClassification;
  sortOrder?: number;
  status?: HistoricalEventStatus;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function assertIsoDate(value: string, field: string): void {
  if (!ISO_DATE_PATTERN.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    throw new Error(`${field} must be a valid ISO date (YYYY-MM-DD).`);
  }
}

function normalizeIds(ids: HistoricalEntityId[] | undefined): HistoricalEntityId[] {
  return [...new Set((ids ?? []).map((id) => id.trim()).filter(Boolean))];
}

export function createHistoricalEvent(input: CreateHistoricalEventInput): HistoricalEvent {
  const id = input.id.trim();
  const eraId = input.eraId.trim();
  const title = input.title.trim();
  const summary = input.summary?.trim() ?? '';
  const endDate = input.endDate ?? null;
  const sortOrder = input.sortOrder ?? 0;

  if (!id) throw new Error('HistoricalEvent id is required.');
  if (!eraId) throw new Error('HistoricalEvent eraId is required.');
  if (!title) throw new Error('HistoricalEvent title is required.');
  assertIsoDate(input.startDate, 'HistoricalEvent startDate');
  if (endDate) assertIsoDate(endDate, 'HistoricalEvent endDate');
  if (endDate && input.startDate > endDate) {
    throw new Error('HistoricalEvent startDate cannot be after endDate.');
  }
  if (!Number.isInteger(sortOrder)) {
    throw new Error('HistoricalEvent sortOrder must be an integer.');
  }

  return {
    id,
    eraId,
    countryIds: normalizeIds(input.countryIds),
    institutionIds: normalizeIds(input.institutionIds),
    personIds: normalizeIds(input.personIds),
    title,
    summary,
    startDate: input.startDate,
    endDate,
    scope: input.scope ?? 'NATIONAL',
    classification: input.classification ?? 'HISTORICAL_FACT',
    sortOrder,
    status: input.status ?? 'DRAFT',
  };
}
