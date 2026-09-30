import type { Institution, InstitutionStatus, InstitutionType } from './institution';
import type { HistoricalEntityId } from './types';

export interface InstitutionListFilter {
  status?: InstitutionStatus;
  type?: InstitutionType;
  parentInstitutionId?: HistoricalEntityId | null;
}

export interface InstitutionRepository {
  findById(id: HistoricalEntityId): Promise<Institution | null>;
  listByCountry(countryId: HistoricalEntityId, filter?: InstitutionListFilter): Promise<Institution[]>;
  save(institution: Institution): Promise<void>;
}
