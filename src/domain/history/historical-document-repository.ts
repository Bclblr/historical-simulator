import type {
  HistoricalDocument,
  HistoricalDocumentStatus,
  HistoricalDocumentType,
} from './historical-document';
import type { HistoricalEntityId } from './types';

export interface HistoricalDocumentListFilter {
  status?: HistoricalDocumentStatus;
  type?: HistoricalDocumentType;
  eventId?: HistoricalEntityId;
  countryId?: HistoricalEntityId;
  institutionId?: HistoricalEntityId;
  personId?: HistoricalEntityId;
}

export interface HistoricalDocumentRepository {
  findById(id: HistoricalEntityId): Promise<HistoricalDocument | null>;
  listByEra(
    eraId: HistoricalEntityId,
    filter?: HistoricalDocumentListFilter,
  ): Promise<HistoricalDocument[]>;
  save(document: HistoricalDocument): Promise<void>;
}
