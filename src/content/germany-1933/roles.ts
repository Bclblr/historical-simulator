import { createHistoricalRole, type HistoricalRole } from '@/domain/history';

export const GERMANY_1933_ROLES: HistoricalRole[] = [
  createHistoricalRole({
    id: 'reich-government-cabinet-official',
    institutionId: 'reich-government',
    name: 'Cabinet Secretariat Official',
    shortName: 'Cabinet Official',
    description:
      'A fictionalized administrative player role used to inspect government files, receive institutional information and record decisions without impersonating a historical perpetrator.',
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
