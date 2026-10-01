import { createInstitution, type Institution } from '@/domain/history';

export const GERMANY_1933_INSTITUTIONS: Institution[] = [
  createInstitution({
    id: 'reich-government',
    countryId: 'germany',
    name: 'Reich Government',
    shortName: 'Reich Government',
    description:
      'The national executive government of Germany. The 1933 scenario uses this institution to model cabinet-level state decisions while keeping party organizations and other institutions distinct.',
    type: 'EXECUTIVE',
    sortOrder: 10,
    status: 'PUBLISHED',
  }),
];

export const GERMANY_1933_DEFAULT_INSTITUTION_ID = 'reich-government';

export function getGermany1933Institutions(): Institution[] {
  return [...GERMANY_1933_INSTITUTIONS];
}
