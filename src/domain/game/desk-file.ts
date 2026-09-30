import type { HistoricalDocument, HistoricalEntityId } from '@/domain/history';

export type DeskFileStatus = 'INBOX' | 'OPEN' | 'REVIEWED' | 'ARCHIVED';

export interface DeskFile {
  id: string;
  eventId: HistoricalEntityId | null;
  title: string;
  documentIds: HistoricalEntityId[];
  status: DeskFileStatus;
  priority: number;
}

export interface CreateDeskFileInput {
  id: string;
  eventId?: HistoricalEntityId | null;
  title: string;
  documentIds?: HistoricalEntityId[];
  status?: DeskFileStatus;
  priority?: number;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createDeskFile(input: CreateDeskFileInput): DeskFile {
  const priority = input.priority ?? 0;
  if (!Number.isInteger(priority)) {
    throw new Error('DeskFile priority must be an integer.');
  }

  return {
    id: required(input.id, 'DeskFile id'),
    eventId: input.eventId?.trim() || null,
    title: required(input.title, 'DeskFile title'),
    documentIds: [...new Set((input.documentIds ?? []).map((id) => id.trim()).filter(Boolean))],
    status: input.status ?? 'INBOX',
    priority,
  };
}

export function getDeskFileDocuments(
  file: DeskFile,
  documents: HistoricalDocument[],
): HistoricalDocument[] {
  const byId = new Map(documents.map((document) => [document.id, document]));
  return file.documentIds
    .map((id) => byId.get(id))
    .filter((document): document is HistoricalDocument => Boolean(document));
}

export function selectNextDeskFile(files: DeskFile[]): DeskFile | null {
  return (
    [...files]
      .filter((file) => file.status === 'INBOX' || file.status === 'OPEN')
      .sort((a, b) => b.priority - a.priority)[0] ?? null
  );
}

export function withDeskFileStatus(
  file: DeskFile,
  status: DeskFileStatus,
): DeskFile {
  return { ...file, status };
}
