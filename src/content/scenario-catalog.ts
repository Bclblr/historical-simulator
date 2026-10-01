import { GERMANY_1933_SCENARIO } from '@/content/germany-1933';
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
    scenarioId: 'germany-1921',
    era: createEra({
      id: 'germany-1921',
      name: 'Almanya · 1921–1945',
      shortName: '1921–1945',
      description:
        'Almanya\'da demokratik kurumların çözüldüğü ve diktatörlüğün pekiştirildiği, Avrupa çapındaki daha geniş siyasi krizin parçası olan bir dönem.',
      startDate: '1933-01-01',
      endDate: '1933-12-31',
      sortOrder: 10,
      status: 'PUBLISHED',
    }),
    countries: [
      createCountry({
        id: 'germany',
        eraId: 'germany-1921',
        name: 'Almanya',
        shortName: 'Almanya',
        description:
          'İlk oynanabilir tarihsel içerik paketi. Simülasyon motoru Almanya\'ya özgü değildir.',
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

export function getScenarioForSelection(
  eraId: string,
  countryId: string,
) {
  if (
    (eraId === 'germany-1921' || GERMANY_1933_SCENARIO.eraId === eraId) &&
    GERMANY_1933_SCENARIO.countryId === countryId
  ) {
    return {
      ...GERMANY_1933_SCENARIO,
      id: 'germany-1921',
      eraId: 'germany-1921',
      startDate: '1921-07-29',
      endDate: '1945-05-08',
    };
  }
  return null;
}

export function getPublishedInstitutionsForSelection(
  eraId: string,
  countryId: string,
) {
  return (
    getScenarioForSelection(eraId, countryId)?.institutions.filter(
      (institution) => institution.status === 'PUBLISHED',
    ) ?? []
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getPublishedRolesForInstitution(
  eraId: string,
  countryId: string,
  institutionId: string,
) {
  return (
    getScenarioForSelection(eraId, countryId)?.roles.filter(
      (role) =>
        role.institutionId === institutionId && role.status === 'PUBLISHED',
    ) ?? []
  ).sort((a, b) => a.sortOrder - b.sortOrder);
}
