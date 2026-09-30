import type { HistoricalEntityId } from './types';

export type CitationTargetType =
  | 'ERA'
  | 'COUNTRY'
  | 'INSTITUTION'
  | 'ROLE'
  | 'PERSON'
  | 'EVENT'
  | 'DOCUMENT';

export interface HistoricalCitation {
  id: HistoricalEntityId;
  sourceId: HistoricalEntityId;
  targetType: CitationTargetType;
  targetId: HistoricalEntityId;
  locator: string | null;
  note: string | null;
}

export interface CreateHistoricalCitationInput {
  id: HistoricalEntityId;
  sourceId: HistoricalEntityId;
  targetType: CitationTargetType;
  targetId: HistoricalEntityId;
  locator?: string | null;
  note?: string | null;
}

export function createHistoricalCitation(
  input: CreateHistoricalCitationInput,
): HistoricalCitation {
  const id = input.id.trim();
  const sourceId = input.sourceId.trim();
  const targetId = input.targetId.trim();
  const locator = input.locator?.trim() || null;
  const note = input.note?.trim() || null;

  if (!id) throw new Error('HistoricalCitation id is required.');
  if (!sourceId) throw new Error('HistoricalCitation sourceId is required.');
  if (!targetId) throw new Error('HistoricalCitation targetId is required.');

  return { id, sourceId, targetType: input.targetType, targetId, locator, note };
}
