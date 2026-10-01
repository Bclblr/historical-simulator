import { createHistoricalRole, type HistoricalRole } from '@/domain/history';

export const GERMANY_1933_ROLES: HistoricalRole[] = [
  createHistoricalRole({
    id: 'reich-government-cabinet-official',
    institutionId: 'reich-government',
    name: 'Kabine Sekreterliği Görevlisi',
    shortName: 'Kabine Görevlisi',
    description:
      'Tarihsel bir kişiyi canlandırmadan devlet dosyalarını incelemek, kurumsal bilgi almak ve simülasyon kararları vermek için kullanılan kurgusal idari oyuncu rolü.',
    type: 'ADMINISTRATIVE',
    sortOrder: 10,
    status: 'PUBLISHED',
  }),
];

export const GERMANY_1933_DEFAULT_ROLE_ID =
  'reich-government-cabinet-official';

export function getGermany1933Roles(): HistoricalRole[] {
  return [...GERMANY_1933_ROLES];
}
