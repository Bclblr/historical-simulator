import { createInstitution, type Institution } from '@/domain/history';

export const GERMANY_1933_INSTITUTIONS: Institution[] = [
  createInstitution({
    id: 'reich-government',
    countryId: 'germany',
    name: 'Reich Hükûmeti',
    shortName: 'Reich Hükûmeti',
    description:
      'Almanya\'nın ulusal yürütme hükûmeti. 1933 senaryosu, parti örgütleri ile diğer kurumları ayrı tutarak kabine düzeyindeki devlet süreçlerini modellemek için bu kurumu kullanır.',
    type: 'EXECUTIVE',
    sortOrder: 10,
    status: 'PUBLISHED',
  }),
];

export const GERMANY_1933_DEFAULT_INSTITUTION_ID = 'reich-government';

export function getGermany1933Institutions(): Institution[] {
  return [...GERMANY_1933_INSTITUTIONS];
}
