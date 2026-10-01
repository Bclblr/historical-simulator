import type { HistoricalEntityId } from '@/domain/history';
import { GERMANY_1933_CHRONOLOGY } from './chronology';

export interface Germany1933SourceAuditEntry {
  eventId: HistoricalEntityId;
  sourceIds: HistoricalEntityId[];
  reviewStatus: 'CROSS_CHECKED' | 'NEEDS_DEDICATED_CITATION';
}

const CROSS_CHECKED_EVENT_IDS = new Set<HistoricalEntityId>([
  'de-1933-papen-hitler-cologne-talks',
  'de-1933-schleicher-resigns',
  'de-1933-hitler-appointed-chancellor',
  'de-1933-reichstag-fire',
  'de-1933-reichstag-fire-decree',
  'de-1933-reichstag-election',
  'de-1933-state-governments-overthrown',
  'de-1933-potsdam-day',
  'de-1933-dachau-established',
  'de-1933-enabling-act',
  'de-1933-first-coordination-law',
  'de-1933-anti-jewish-boycott',
  'de-1933-civil-service-law',
  'de-1933-second-coordination-law',
  'de-1933-book-burnings',
  'de-1933-spd-banned',
  'de-1933-one-party-state',
  'de-1933-editor-law',
  'de-1933-league-withdrawal-announced',
  'de-1933-geneva-disarmament-exit',
  'de-1933-november-single-list-election',
  'de-1933-reich-culture-chamber',
  'de-1933-party-state-law',
]);

export const GERMANY_1933_SOURCE_AUDIT: Germany1933SourceAuditEntry[] =
  GERMANY_1933_CHRONOLOGY.map((event) => ({
    eventId: event.id,
    sourceIds: CROSS_CHECKED_EVENT_IDS.has(event.id)
      ? [
          'ushmm-1933-key-dates',
          'dhm-lemo-1933-chronology',
          'dhm-lemo-gleichschaltung',
        ]
      : ['dhm-lemo-1933-chronology'],
    reviewStatus: CROSS_CHECKED_EVENT_IDS.has(event.id)
      ? 'CROSS_CHECKED'
      : 'NEEDS_DEDICATED_CITATION',
  }));

export function getGermany1933SourceAudit(): Germany1933SourceAuditEntry[] {
  return GERMANY_1933_SOURCE_AUDIT.map((entry) => ({
    ...entry,
    sourceIds: [...entry.sourceIds],
  }));
}
