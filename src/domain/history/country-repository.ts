import type { Country, CountryStatus } from './country';
import type { HistoricalEntityId } from './types';

export interface CountryRepository {
  findById(id: HistoricalEntityId): Promise<Country | null>;
  listByEra(eraId: HistoricalEntityId, status?: CountryStatus): Promise<Country[]>;
  save(country: Country): Promise<void>;
}
