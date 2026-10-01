import { createInitialGameState, type GameState } from '@/domain/game';
import type { EventConnection, HistoricalDocument, HistoricalEvent, Institution, HistoricalRole } from '@/domain/history';
import { GERMANY_1933_CHRONOLOGY } from './chronology';
import {
  GERMANY_1921_1932_CHRONOLOGY,
  GERMANY_1934_1938_CHRONOLOGY,
  GERMANY_1939_1945_CHRONOLOGY,
} from '@/content/germany-campaign';
import { GERMANY_1933_EVENT_CONNECTIONS } from './event-connections';
import {
  GERMANY_1933_DEFAULT_INSTITUTION_ID,
  GERMANY_1933_INSTITUTIONS,
} from './institutions';
import {
  GERMANY_1933_DEFAULT_ROLE_ID,
  GERMANY_1933_ROLES,
} from './roles';

export interface Germany1933Scenario {
  id: 'germany-1933';
  eraId: '1933';
  countryId: 'germany';
  startDate: '1933-01-04';
  endDate: '1933-12-31';
  institutions: Institution[];
  roles: HistoricalRole[];
  events: HistoricalEvent[];
  documents: HistoricalDocument[];
  connections: EventConnection[];
}

export const GERMANY_1933_SCENARIO: Germany1933Scenario = {
  id: 'germany-1933',
  eraId: '1933',
  countryId: 'germany',
  startDate: '1933-01-04',
  endDate: '1933-12-31',
  institutions: GERMANY_1933_INSTITUTIONS,
  roles: GERMANY_1933_ROLES,
  events: [
    ...GERMANY_1921_1932_CHRONOLOGY,
    ...GERMANY_1933_CHRONOLOGY,
    ...GERMANY_1934_1938_CHRONOLOGY,
    ...GERMANY_1939_1945_CHRONOLOGY,
  ].sort((a, b) => a.startDate.localeCompare(b.startDate) || a.sortOrder - b.sortOrder),
  documents: [],
  connections: GERMANY_1933_EVENT_CONNECTIONS,
};

export function createGermany1933InitialState(
  sessionId: string,
): GameState {
  return createInitialGameState({
    sessionId,
    startDate: GERMANY_1933_SCENARIO.startDate,
    selection: {
      eraId: GERMANY_1933_SCENARIO.eraId,
      countryId: GERMANY_1933_SCENARIO.countryId,
      institutionId: GERMANY_1933_DEFAULT_INSTITUTION_ID,
      roleId: GERMANY_1933_DEFAULT_ROLE_ID,
    },
  });
}
