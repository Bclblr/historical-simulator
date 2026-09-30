import type {
  HistoricalEvent,
  HistoricalEventStatus,
} from './historical-event';
import type { HistoricalEntityId } from './types';

export interface HistoricalEventListFilter {
  status?: HistoricalEventStatus;
  countryId?: HistoricalEntityId;
  institutionId?: HistoricalEntityId;
  personId?: HistoricalEntityId;
  fromDate?: string;
  toDate?: string;
}

export interface HistoricalEventRepository {
  findById(id: HistoricalEntityId): Promise<HistoricalEvent | null>;
  listByEra(
    eraId: HistoricalEntityId,
    filter?: HistoricalEventListFilter,
  ): Promise<HistoricalEvent[]>;
  save(event: HistoricalEvent): Promise<void>;
}
