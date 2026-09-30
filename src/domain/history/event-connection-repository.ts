import type {
  EventConnection,
  EventConnectionStatus,
  EventConnectionType,
} from './event-connection';
import type { HistoricalEntityId } from './types';

export interface EventConnectionListFilter {
  status?: EventConnectionStatus;
  type?: EventConnectionType;
}

export interface EventConnectionRepository {
  findById(id: HistoricalEntityId): Promise<EventConnection | null>;
  listFromEvent(
    eventId: HistoricalEntityId,
    filter?: EventConnectionListFilter,
  ): Promise<EventConnection[]>;
  listToEvent(
    eventId: HistoricalEntityId,
    filter?: EventConnectionListFilter,
  ): Promise<EventConnection[]>;
  save(connection: EventConnection): Promise<void>;
}
