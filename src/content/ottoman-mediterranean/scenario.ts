import { createInitialGameState, type GameState } from '@/domain/game';
import { createCountry, createEra, createInstitution, createHistoricalRole, type Country, type Era, type Institution, type HistoricalRole } from '@/domain/history';

export interface OttomanMediterraneanScenario {
  id: 'ottoman-mediterranean';
  eraId: 'mediterranean-1550';
  countryId: 'ottoman-mediterranean';
  startDate: '1550-01-01';
  endDate: '1700-12-31';
  era: Era;
  countries: Country[];
  institutions: Institution[];
  roles: HistoricalRole[];
}

export const OTTOMAN_MEDITERRANEAN_ERA = createEra({
  id: 'mediterranean-1550',
  name: 'Akdeniz’in Gölgesinde · 1550–1700',
  shortName: '1550–1700',
  description:
    'Sultanın Casusları ve Sultanın Korsanları’ndaki istihbarat ağları, denizcilik, liman hayatı, ticaret, esaret, kimlik ve sosyal ilişkilerden esinlenen dallanan bir hayat simülasyonu.',
  startDate: '1550-01-01',
  endDate: '1700-12-31',
  sortOrder: 20,
  status: 'PUBLISHED',
});

export const OTTOMAN_MEDITERRANEAN_COUNTRY = createCountry({
  id: 'ottoman-mediterranean',
  eraId: 'mediterranean-1550',
  name: 'Osmanlı Akdeniz Dünyası',
  shortName: 'Osmanlı Akdeniz’i',
  description:
    'Oyuncunun limanlar, denizcilik, ticaret, aile ve farklı bilgi ağları arasında kendi hayat yolunu kurduğu tarihsel yaşam simülasyonu.',
  sortOrder: 20,
  status: 'PUBLISHED',
});

export const OTTOMAN_MEDITERRANEAN_INSTITUTION = createInstitution({
  id: 'mediterranean-port-world',
  countryId: 'ottoman-mediterranean',
  name: 'Akdeniz Liman Dünyası',
  shortName: 'Liman Dünyası',
  description:
    'Devlet merkezindeki tek bir makamı değil; liman, ticaret, denizcilik ve bilgi ağlarının kesiştiği sosyal dünyayı temsil eden oyun kurumu.',
  type: 'OTHER',
  sortOrder: 10,
  status: 'PUBLISHED',
});

export const OTTOMAN_MEDITERRANEAN_ROLES: HistoricalRole[] = [
  createHistoricalRole({
    id: 'med-port-worker',
    institutionId: 'mediterranean-port-world',
    name: 'Liman İşçisi',
    shortName: 'Liman İşçisi',
    description: 'Karada başlayıp ticaret, aile ve bilgi ağlarına açılan hayat yolu.',
    type: 'ADMINISTRATIVE',
    sortOrder: 10,
    status: 'PUBLISHED',
  }),
  createHistoricalRole({
    id: 'med-sailor',
    institutionId: 'mediterranean-port-world',
    name: 'Genç Denizci',
    shortName: 'Denizci',
    description: 'Tayfa hayatı, gemi düzeni ve deniz çevresi üzerinden ilerleyen hayat yolu.',
    type: 'MILITARY',
    sortOrder: 20,
    status: 'PUBLISHED',
  }),
  createHistoricalRole({
    id: 'med-trader',
    institutionId: 'mediterranean-port-world',
    name: 'Tüccar Ailesinin Çırağı',
    shortName: 'Tüccar Çırağı',
    description: 'Borç, sermaye, liman bağlantıları ve ticari ilişkiler üzerinden ilerleyen hayat yolu.',
    type: 'ADMINISTRATIVE',
    sortOrder: 30,
    status: 'PUBLISHED',
  }),
  createHistoricalRole({
    id: 'med-interpreter',
    institutionId: 'mediterranean-port-world',
    name: 'Liman Aracısı',
    shortName: 'Aracı',
    description: 'Dil, farklı topluluklar ve bilgi akışları arasında aracılık eden kurgusal oyuncu rolü.',
    type: 'ADMINISTRATIVE',
    sortOrder: 40,
    status: 'PUBLISHED',
  }),
];

export const OTTOMAN_MEDITERRANEAN_SCENARIO: OttomanMediterraneanScenario = {
  id: 'ottoman-mediterranean',
  eraId: 'mediterranean-1550',
  countryId: 'ottoman-mediterranean',
  startDate: '1550-01-01',
  endDate: '1700-12-31',
  era: OTTOMAN_MEDITERRANEAN_ERA,
  countries: [OTTOMAN_MEDITERRANEAN_COUNTRY],
  institutions: [OTTOMAN_MEDITERRANEAN_INSTITUTION],
  roles: OTTOMAN_MEDITERRANEAN_ROLES,
};

export function createOttomanMediterraneanInitialState(
  sessionId: string,
  roleId = 'med-port-worker',
): GameState {
  return createInitialGameState({
    sessionId,
    startDate: OTTOMAN_MEDITERRANEAN_SCENARIO.startDate,
    selection: {
      eraId: OTTOMAN_MEDITERRANEAN_SCENARIO.eraId,
      countryId: OTTOMAN_MEDITERRANEAN_SCENARIO.countryId,
      institutionId: OTTOMAN_MEDITERRANEAN_INSTITUTION.id,
      roleId,
    },
    flags: {},
    variables: {
      money: 50,
      safety: 55,
      social: 50,
      reputation: 50,
      familyTies: 50,
      merchantNetwork: 0,
      sailorNetwork: 0,
      intelligenceNetwork: 0,
      portReputation: 0,
      shipTrust: 0,
      information: 0,
      language: 0,
      debt: 0,
    },
  });
}
