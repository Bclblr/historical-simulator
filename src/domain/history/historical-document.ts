import type {
  HistoricalContentClassification,
  HistoricalEntityId,
} from './types';

export type HistoricalDocumentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export type HistoricalDocumentType =
  | 'LETTER'
  | 'TELEGRAM'
  | 'MEMORANDUM'
  | 'REPORT'
  | 'LAW'
  | 'DECREE'
  | 'TREATY'
  | 'SPEECH'
  | 'NEWSPAPER'
  | 'DIARY'
  | 'MINUTES'
  | 'PHOTOGRAPH'
  | 'MAP'
  | 'OTHER';

export interface HistoricalDocument {
  id: HistoricalEntityId;
  eraId: HistoricalEntityId;
  eventIds: HistoricalEntityId[];
  countryIds: HistoricalEntityId[];
  institutionIds: HistoricalEntityId[];
  personIds: HistoricalEntityId[];
  title: string;
  documentDate: string | null;
  type: HistoricalDocumentType;
  language: string | null;
  transcription: string;
  summary: string;
  classification: HistoricalContentClassification;
  sortOrder: number;
  status: HistoricalDocumentStatus;
}

export interface CreateHistoricalDocumentInput {
  id: HistoricalEntityId;
  eraId: HistoricalEntityId;
  eventIds?: HistoricalEntityId[];
  countryIds?: HistoricalEntityId[];
  institutionIds?: HistoricalEntityId[];
  personIds?: HistoricalEntityId[];
  title: string;
  documentDate?: string | null;
  type?: HistoricalDocumentType;
  language?: string | null;
  transcription?: string;
  summary?: string;
  classification?: HistoricalContentClassification;
  sortOrder?: number;
  status?: HistoricalDocumentStatus;
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

export function createHistoricalDocument(
  input: CreateHistoricalDocumentInput,
): HistoricalDocument {
  const id = input.id.trim();
  const eraId = input.eraId.trim();
  const title = input.title.trim();
  const documentDate = input.documentDate ?? null;
  const language = input.language?.trim() || null;
  const transcription = input.transcription?.trim() ?? '';
  const summary = input.summary?.trim() ?? '';
  const sortOrder = input.sortOrder ?? 0;

  if (!id) throw new Error('HistoricalDocument id is required.');
  if (!eraId) throw new Error('HistoricalDocument eraId is required.');
  if (!title) throw new Error('HistoricalDocument title is required.');
  if (documentDate) assertIsoDate(documentDate, 'HistoricalDocument documentDate');
  if (!Number.isInteger(sortOrder)) {
    throw new Error('HistoricalDocument sortOrder must be an integer.');
  }

  return {
    id,
    eraId,
    eventIds: normalizeIds(input.eventIds),
    countryIds: normalizeIds(input.countryIds),
    institutionIds: normalizeIds(input.institutionIds),
    personIds: normalizeIds(input.personIds),
    title,
    documentDate,
    type: input.type ?? 'OTHER',
    language,
    transcription,
    summary,
    classification: input.classification ?? 'PRIMARY_SOURCE',
    sortOrder,
    status: input.status ?? 'DRAFT',
  };
}
