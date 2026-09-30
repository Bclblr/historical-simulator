import type {
  HistoricalPerson,
  HistoricalPersonStatus,
  HistoricalRoleTenure,
} from './historical-person';
import type { HistoricalEntityId } from './types';

export interface HistoricalPersonRepository {
  findById(id: HistoricalEntityId): Promise<HistoricalPerson | null>;
  list(status?: HistoricalPersonStatus): Promise<HistoricalPerson[]>;
  save(person: HistoricalPerson): Promise<void>;
}

export interface HistoricalRoleTenureRepository {
  listByPerson(personId: HistoricalEntityId): Promise<HistoricalRoleTenure[]>;
  listByRole(roleId: HistoricalEntityId): Promise<HistoricalRoleTenure[]>;
  save(tenure: HistoricalRoleTenure): Promise<void>;
}
