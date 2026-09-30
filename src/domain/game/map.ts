import type { HistoricalEntityId } from '@/domain/history';

export type MapLocationKind =
  | 'CAPITAL'
  | 'CITY'
  | 'REGION'
  | 'BORDER'
  | 'INSTITUTION'
  | 'EVENT_SITE'
  | 'OTHER';

export interface MapCoordinate {
  latitude: number;
  longitude: number;
}

export interface MapLocation {
  id: string;
  eraId: HistoricalEntityId;
  countryIds: HistoricalEntityId[];
  institutionIds: HistoricalEntityId[];
  eventIds: HistoricalEntityId[];
  name: string;
  kind: MapLocationKind;
  coordinate: MapCoordinate;
}

export interface CreateMapLocationInput {
  id: string;
  eraId: HistoricalEntityId;
  countryIds?: HistoricalEntityId[];
  institutionIds?: HistoricalEntityId[];
  eventIds?: HistoricalEntityId[];
  name: string;
  kind?: MapLocationKind;
  coordinate: MapCoordinate;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function normalizeIds(ids: HistoricalEntityId[] | undefined): HistoricalEntityId[] {
  return [...new Set((ids ?? []).map((id) => id.trim()).filter(Boolean))];
}

function validateCoordinate(coordinate: MapCoordinate): MapCoordinate {
  if (
    !Number.isFinite(coordinate.latitude) ||
    coordinate.latitude < -90 ||
    coordinate.latitude > 90
  ) {
    throw new Error('MapLocation latitude must be between -90 and 90.');
  }
  if (
    !Number.isFinite(coordinate.longitude) ||
    coordinate.longitude < -180 ||
    coordinate.longitude > 180
  ) {
    throw new Error('MapLocation longitude must be between -180 and 180.');
  }
  return { ...coordinate };
}

export function createMapLocation(input: CreateMapLocationInput): MapLocation {
  return {
    id: required(input.id, 'MapLocation id'),
    eraId: required(input.eraId, 'MapLocation eraId'),
    countryIds: normalizeIds(input.countryIds),
    institutionIds: normalizeIds(input.institutionIds),
    eventIds: normalizeIds(input.eventIds),
    name: required(input.name, 'MapLocation name'),
    kind: input.kind ?? 'OTHER',
    coordinate: validateCoordinate(input.coordinate),
  };
}

export function getMapLocationsForEvent(
  locations: MapLocation[],
  eventId: HistoricalEntityId,
): MapLocation[] {
  return locations.filter((location) => location.eventIds.includes(eventId));
}

export function getMapLocationsForCountry(
  locations: MapLocation[],
  countryId: HistoricalEntityId,
  eraId?: HistoricalEntityId,
): MapLocation[] {
  return locations.filter(
    (location) =>
      location.countryIds.includes(countryId) &&
      (eraId === undefined || location.eraId === eraId),
  );
}
