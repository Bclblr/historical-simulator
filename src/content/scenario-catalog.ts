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
      name: 'Almanya · 1933–1945',
      shortName: '1933–1945',
      description:
        '1933–1945 Almanya’sında yaşayan kurgusal bir kişinin gündelik hayatına odaklanan, kararlarla dallanan yaşam simülasyonu.',
      startDate: '1933-01-30',
      endDate: '1945-05-08',
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
          'Tarihsel gelişmelerin arka planda ilerlediği; iş, para, güvenlik, çevre ve itibar kararlarının oyuncunun kişisel hikâyesini değiştirdiği yaşam simülasyonu.',
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
  if (GERMANY_1933_SCENARIO.countryId !== countryId) return null;

  if (eraId === GERMANY_1933_SCENARIO.eraId) {
    return GERMANY_1933_SCENARIO;
  }

  if (eraId === 'germany-1921') {
    return {
      ...GERMANY_1933_SCENARIO,
      id: 'germany-1921',
      eraId: 'germany-1921',
      startDate: '1933-01-30',
      endDate: '1945-05-08',
      events: GERMANY_1933_SCENARIO.events.map((event) => ({
        ...event,
        eraId: 'germany-1921',
      })),
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
