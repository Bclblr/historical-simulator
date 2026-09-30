import type { HistoricalEntityId } from './types';

export type EventConnectionType =
  | 'PRECEDES'
  | 'FOLLOWS'
  | 'CONTEXT'
  | 'RELATED'
  | 'ESCALATES'
  | 'RESPONDS_TO'
  | 'CONTRIBUTES_TO'
  | 'DISPUTED_CAUSAL_LINK';

export type EventConnectionStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface EventConnection {
  id: HistoricalEntityId;
  sourceEventId: HistoricalEntityId;
  targetEventId: HistoricalEntityId;
  type: EventConnectionType;
  description: string;
  citationIds: HistoricalEntityId[];
  status: EventConnectionStatus;
}

export interface CreateEventConnectionInput {
  id: HistoricalEntityId;
  sourceEventId: HistoricalEntityId;
  targetEventId: HistoricalEntityId;
  type: EventConnectionType;
  description?: string;
  citationIds?: HistoricalEntityId[];
  status?: EventConnectionStatus;
}

function normalizeIds(ids: HistoricalEntityId[] | undefined): HistoricalEntityId[] {
  return [...new Set((ids ?? []).map((id) => id.trim()).filter(Boolean))];
}

export function createEventConnection(input: CreateEventConnectionInput): EventConnection {
  const id = input.id.trim();
  const sourceEventId = input.sourceEventId.trim();
  const targetEventId = input.targetEventId.trim();
  const description = input.description?.trim() ?? '';

  if (!id) throw new Error('EventConnection id is required.');
  if (!sourceEventId) throw new Error('EventConnection sourceEventId is required.');
  if (!targetEventId) throw new Error('EventConnection targetEventId is required.');
  if (sourceEventId === targetEventId) {
    throw new Error('EventConnection cannot connect an event to itself.');
  }

  return {
    id,
    sourceEventId,
    targetEventId,
    type: input.type,
    description,
    citationIds: normalizeIds(input.citationIds),
    status: input.status ?? 'DRAFT',
  };
}
