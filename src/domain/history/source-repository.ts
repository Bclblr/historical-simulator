import type { HistoricalCitation, CitationTargetType } from './citation';
import type { HistoricalSource, SourceStatus, SourceType } from './source';
import type { HistoricalEntityId } from './types';

export interface HistoricalSourceListFilter {
  status?: SourceStatus;
  type?: SourceType;
}

export interface HistoricalSourceRepository {
  findById(id: HistoricalEntityId): Promise<HistoricalSource | null>;
  list(filter?: HistoricalSourceListFilter): Promise<HistoricalSource[]>;
  save(source: HistoricalSource): Promise<void>;
}

export interface HistoricalCitationRepository {
  listByTarget(
    targetType: CitationTargetType,
    targetId: HistoricalEntityId,
  ): Promise<HistoricalCitation[]>;
  save(citation: HistoricalCitation): Promise<void>;
}
