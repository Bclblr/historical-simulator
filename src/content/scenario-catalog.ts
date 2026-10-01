import {
  createCountry,
  createEra,
  type Country,
  type Era,
} from '@/domain/history';

export interface ScenarioCatalogEntry {
  scenarioId: string;
  era: Era;
  countries: Country[];
}

export const SCENARIO_CATALOG: ScenarioCatalogEntry[] = [
  {
    scenarioId: 'germany-1933',
    era: createEra({
      id: '1933',
      name: '1933',
      shortName: '1933',
      description:
        'Democratic institutions collapse and dictatorship is consolidated in Germany amid a wider European political crisis.',
      startDate: '1933-01-01',
      endDate: '1933-12-31',
      sortOrder: 10,
      status: 'PUBLISHED',
    }),
    countries: [
      createCountry({
        id: 'germany',
        eraId: '1933',
        name: 'Germany',
        shortName: 'Germany',
        description:
          'The first playable historical content pack. The simulation engine itself is not Germany-specific.',
        sortOrder: 10,
        status: 'PUBLISHED',
      }),
    ],
  },
];

export function getPublishedEras(): Era[] {
  return SCENARIO_CATALOG.map((entry) => entry.era)
    .filter((era) => era.status === 'PUBLISHED')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedCountriesForEra(eraId: string): Country[] {
  return SCENARIO_CATALOG.filter((entry) => entry.era.id === eraId)
    .flatMap((entry) => entry.countries)
    .filter((country) => country.status === 'PUBLISHED')
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
