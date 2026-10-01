import type { HistoricalEvent } from '@/domain/history';
import { createHistoricalEvent } from '@/domain/history';

export const GERMANY_1933_CHRONOLOGY: HistoricalEvent[] = [
  createHistoricalEvent({
    id: 'de-1933-hitler-appointed-chancellor',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Adolf Hitler appointed Chancellor',
    summary:
      'President Paul von Hindenburg appointed Adolf Hitler Chancellor of Germany.',
    startDate: '1933-01-30',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 10,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-reichstag-fire',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Reichstag fire',
    summary:
      'The Reichstag building burned in Berlin. The regime used the fire to intensify repression of political opponents.',
    startDate: '1933-02-27',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 20,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-reichstag-fire-decree',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Reichstag Fire Decree',
    summary:
      'President Hindenburg issued an emergency decree suspending key constitutional protections and enabling detention and repression of political opponents.',
    startDate: '1933-02-28',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 30,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-reichstag-election',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Reichstag election',
    summary:
      'The Nazi Party won 43.9 percent of the vote and remained dependent on its coalition partner for a parliamentary majority.',
    startDate: '1933-03-05',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 40,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-dachau-established',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Dachau concentration camp established',
    summary:
      'A concentration camp was established outside Dachau for political opponents of the regime.',
    startDate: '1933-03-22',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 50,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-enabling-act',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Enabling Act passed',
    summary:
      'The Reichstag passed the Enabling Act, allowing the government to enact laws without parliamentary consent and providing a cornerstone of the dictatorship.',
    startDate: '1933-03-23',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 60,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-anti-jewish-boycott',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Nationwide anti-Jewish boycott',
    summary:
      'Nazi Party members and affiliated organizations organized a nationwide boycott of Jewish-owned businesses.',
    startDate: '1933-04-01',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 70,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-civil-service-law',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Law for the Restoration of the Professional Civil Service',
    summary:
      'The law excluded Jews and political opponents from civil-service positions, subject to initial exemptions.',
    startDate: '1933-04-07',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 80,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-book-burnings',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Book burnings',
    summary:
      'Pro-Nazi student organizations carried out public book burnings targeting works labeled “un-German,” including works by Jewish authors and political opponents.',
    startDate: '1933-05-10',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 90,
    status: 'PUBLISHED',
  }),
  createHistoricalEvent({
    id: 'de-1933-one-party-state',
    eraId: '1933',
    countryIds: ['germany'],
    title: 'Germany becomes a one-party state',
    summary:
      'By July 14, the Nazi Party was the only legal political party in Germany.',
    startDate: '1933-07-14',
    scope: 'NATIONAL',
    classification: 'HISTORICAL_FACT',
    sortOrder: 100,
    status: 'PUBLISHED',
  }),
];

export function getGermany1933Chronology(): HistoricalEvent[] {
  return [...GERMANY_1933_CHRONOLOGY];
}
