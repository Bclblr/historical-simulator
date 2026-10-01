import type { HistoricalEntityId } from './types';
import type { ArchiveReference } from './archive-reference';

export type SourceStatus = 'DRAFT' | 'VERIFIED' | 'ARCHIVED';

export type SourceType =
  | 'ARCHIVAL_RECORD'
  | 'PRIMARY_PUBLISHED'
  | 'MONOGRAPH'
  | 'EDITED_VOLUME'
  | 'BOOK_CHAPTER'
  | 'JOURNAL_ARTICLE'
  | 'THESIS'
  | 'REFERENCE_WORK'
  | 'MUSEUM_OR_INSTITUTION'
  | 'OTHER';

export type SourceConfidence = 'A' | 'B' | 'C' | 'D';

export interface HistoricalSource {
  id: HistoricalEntityId;
  type: SourceType;
  title: string;
  authors: string[];
  editors: string[];
  publisher: string | null;
  publicationYear: number | null;
  journalOrCollection: string | null;
  volume: string | null;
  issue: string | null;
  archiveName: string | null;
  archiveReference: string | null;
  structuredArchiveReference?: ArchiveReference | null;
  url: string | null;
  accessedDate: string | null;
  isbn: string | null;
  doi: string | null;
  language: string | null;
  confidence: SourceConfidence;
  status: SourceStatus;
}

export interface CreateHistoricalSourceInput extends Omit<HistoricalSource, 'authors' | 'editors'> {
  authors?: string[];
  editors?: string[];
}

function normalizeStrings(values: string[] | undefined): string[] {
  return [...new Set((values ?? []).map((value) => value.trim()).filter(Boolean))];
}

export function createHistoricalSource(input: CreateHistoricalSourceInput): HistoricalSource {
  const id = input.id.trim();
  const title = input.title.trim();

  if (!id) throw new Error('HistoricalSource id is required.');
  if (!title) throw new Error('HistoricalSource title is required.');
  if (input.publicationYear !== null && !Number.isInteger(input.publicationYear)) {
    throw new Error('HistoricalSource publicationYear must be an integer or null.');
  }

  return {
    ...input,
    id,
    title,
    authors: normalizeStrings(input.authors),
    editors: normalizeStrings(input.editors),
  };
}
