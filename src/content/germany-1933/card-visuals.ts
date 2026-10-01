export type HistoricalVisualKind =
  | 'PARLIAMENT'
  | 'GOVERNMENT'
  | 'LAW'
  | 'DIPLOMACY'
  | 'PRESS'
  | 'LABOR'
  | 'EDUCATION'
  | 'CULTURE'
  | 'POLICE'
  | 'MILITARY'
  | 'INFRASTRUCTURE'
  | 'CIVIL_SOCIETY';

export interface HistoricalCardVisual {
  kind: HistoricalVisualKind;
  glyph: string;
  label: string;
}

const visualByEvent: Record<string, HistoricalCardVisual> = {
  'de-1933-papen-hitler-cologne-talks': { kind: 'GOVERNMENT', glyph: '⌂', label: 'Siyasi görüşmeler' },
  'de-1933-schleicher-resigns': { kind: 'GOVERNMENT', glyph: '⌂', label: 'Hükûmet krizi' },
  'de-1933-hitler-appointed-chancellor': { kind: 'GOVERNMENT', glyph: '⌂', label: 'Şansölyelik' },
  'de-1933-military-leadership-meeting': { kind: 'MILITARY', glyph: '◇', label: 'Askerî liderlik' },
  'de-1933-auxiliary-police-prussia': { kind: 'POLICE', glyph: '◈', label: 'Kamu güvenliği' },
  'de-1933-reichstag-fire': { kind: 'PARLIAMENT', glyph: '▥', label: 'Reichstag' },
  'de-1933-reichstag-fire-decree': { kind: 'LAW', glyph: '§', label: 'Olağanüstü kararname' },
  'de-1933-reichstag-election': { kind: 'PARLIAMENT', glyph: '▥', label: 'Reichstag seçimi' },
  'de-1933-state-governments-overthrown': { kind: 'GOVERNMENT', glyph: '⌂', label: 'Eyalet yönetimleri' },
  'de-1933-potsdam-day': { kind: 'GOVERNMENT', glyph: '⌂', label: 'Devlet töreni' },
  'de-1933-dachau-established': { kind: 'POLICE', glyph: '◈', label: 'Baskı aygıtı' },
  'de-1933-enabling-act': { kind: 'LAW', glyph: '§', label: 'Yasama yetkisi' },
  'de-1933-first-coordination-law': { kind: 'LAW', glyph: '§', label: 'Merkezileşme' },
  'de-1933-anti-jewish-boycott': { kind: 'CIVIL_SOCIETY', glyph: '◎', label: 'Toplumsal dışlama' },
  'de-1933-civil-service-law': { kind: 'LAW', glyph: '§', label: 'Kamu hizmeti' },
  'de-1933-second-coordination-law': { kind: 'LAW', glyph: '§', label: 'Reich valileri' },
  'de-1933-aryan-paragraph-decree': { kind: 'LAW', glyph: '§', label: 'Ayrımcı düzenleme' },
  'de-1933-prussian-academy-exclusions': { kind: 'EDUCATION', glyph: '▤', label: 'Akademik kurumlar' },
  'de-1933-school-university-quota-law': { kind: 'EDUCATION', glyph: '▤', label: 'Eğitim' },
  'de-1933-gestapo-created': { kind: 'POLICE', glyph: '◈', label: 'Siyasi polis' },
  'de-1933-may-day-state-holiday': { kind: 'LABOR', glyph: '⚙', label: 'Emek' },
  'de-1933-free-trade-unions-dismantled': { kind: 'LABOR', glyph: '⚙', label: 'Sendikalar' },
  'de-1933-jewish-reichswehr-employees-dismissed': { kind: 'MILITARY', glyph: '◇', label: 'Reichswehr' },
  'de-1933-book-burnings': { kind: 'CULTURE', glyph: '▤', label: 'Kültür ve sansür' },
  'de-1933-german-labor-front': { kind: 'LABOR', glyph: '⚙', label: 'Çalışma örgütleri' },
  'de-1933-unemployment-reduction-law': { kind: 'LABOR', glyph: '⚙', label: 'İstihdam' },
  'de-1933-youth-organizations-coordinated': { kind: 'CIVIL_SOCIETY', glyph: '◎', label: 'Gençlik örgütleri' },
  'de-1933-spd-banned': { kind: 'PARLIAMENT', glyph: '▥', label: 'Siyasi partiler' },
  'de-1933-dnvp-dissolves': { kind: 'PARLIAMENT', glyph: '▥', label: 'Siyasi partiler' },
  'de-1933-autobahn-project-announced': { kind: 'INFRASTRUCTURE', glyph: '═', label: 'Altyapı' },
  'de-1933-radio-control-consolidated': { kind: 'PRESS', glyph: '◉', label: 'Radyo yayıncılığı' },
  'de-1933-dvp-dissolves': { kind: 'PARLIAMENT', glyph: '▥', label: 'Siyasi partiler' },
  'de-1933-center-party-dissolves': { kind: 'PARLIAMENT', glyph: '▥', label: 'Siyasi partiler' },
  'de-1933-one-party-state': { kind: 'PARLIAMENT', glyph: '▥', label: 'Tek parti sistemi' },
  'de-1933-forced-sterilization-law': { kind: 'LAW', glyph: '§', label: 'Ayrımcı mevzuat' },
  'de-1933-citizenship-revocation-law': { kind: 'LAW', glyph: '§', label: 'Vatandaşlık hukuku' },
  'de-1933-reich-concordat': { kind: 'DIPLOMACY', glyph: '◫', label: 'Diplomatik anlaşma' },
  'de-1933-central-organization-german-jews': { kind: 'CIVIL_SOCIETY', glyph: '◎', label: 'Sivil toplum' },
  'de-1933-culture-chambers-exclusion': { kind: 'CULTURE', glyph: '▤', label: 'Kültür meslekleri' },
  'de-1933-hereditary-farm-law': { kind: 'LAW', glyph: '§', label: 'Tarım mevzuatı' },
  'de-1933-editor-law': { kind: 'PRESS', glyph: '◉', label: 'Basın' },
  'de-1933-league-withdrawal-announced': { kind: 'DIPLOMACY', glyph: '◫', label: 'Dış politika' },
  'de-1933-geneva-disarmament-exit': { kind: 'DIPLOMACY', glyph: '◫', label: 'Silahsızlanma diplomasisi' },
  'de-1933-league-referendum-election': { kind: 'PARLIAMENT', glyph: '▥', label: 'Referandum ve seçim' },
  'de-1933-november-single-list-election': { kind: 'PARLIAMENT', glyph: '▥', label: 'Reichstag seçimi' },
  'de-1933-reich-culture-chamber': { kind: 'CULTURE', glyph: '▤', label: 'Kültür kurumları' },
  'de-1933-habitual-criminals-law': { kind: 'LAW', glyph: '§', label: 'Ceza hukuku' },
  'de-1933-party-state-law': { kind: 'LAW', glyph: '§', label: 'Parti-devlet ilişkisi' },
  'de-1933-political-police-centralization': { kind: 'POLICE', glyph: '◈', label: 'Siyasi polis' },
  'de-1933-lawyers-restricted': { kind: 'LAW', glyph: '§', label: 'Hukuk mesleği' },
};

export function getGermany1933CardVisual(eventId: string): HistoricalCardVisual {
  return visualByEvent[eventId] ?? { kind: 'GOVERNMENT', glyph: '◇', label: 'Tarihsel gelişme' };
}
