import { OTTOMAN_MEDITERRANEAN_SCENARIO } from '@/content/ottoman-mediterranean';
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
    scenarioId: 'ottoman-mediterranean',
    era: OTTOMAN_MEDITERRANEAN_SCENARIO.era,
    countries: OTTOMAN_MEDITERRANEAN_SCENARIO.countries,
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
    OTTOMAN_MEDITERRANEAN_SCENARIO.countryId === countryId &&
    eraId === OTTOMAN_MEDITERRANEAN_SCENARIO.eraId
  ) {
    return OTTOMAN_MEDITERRANEAN_SCENARIO;
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
