import { createEventConnection, type EventConnection } from '@/domain/history';

export const GERMANY_1933_EVENT_CONNECTIONS: EventConnection[] = [
  createEventConnection({
    id: 'de-1933-link-fire-decree',
    sourceEventId: 'de-1933-reichstag-fire',
    targetEventId: 'de-1933-reichstag-fire-decree',
    type: 'CONTRIBUTES_TO',
    description:
      'The government used the Reichstag fire as the immediate justification for the emergency decree and intensified repression.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-decree-state-governments',
    sourceEventId: 'de-1933-reichstag-fire-decree',
    targetEventId: 'de-1933-state-governments-overthrown',
    type: 'CONTRIBUTES_TO',
    description:
      'Emergency powers enabled the central government to override and displace state governments.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-election-enabling-act',
    sourceEventId: 'de-1933-reichstag-election',
    targetEventId: 'de-1933-enabling-act',
    type: 'PRECEDES',
    description:
      'The March election preceded the parliamentary passage of the Enabling Act under conditions of repression and intimidation.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-enabling-coordination',
    sourceEventId: 'de-1933-enabling-act',
    targetEventId: 'de-1933-first-coordination-law',
    type: 'CONTRIBUTES_TO',
    description:
      'The Enabling Act provided the government with legislative power used during the coordination and centralization of the federal states.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-first-second-coordination',
    sourceEventId: 'de-1933-first-coordination-law',
    targetEventId: 'de-1933-second-coordination-law',
    type: 'PRECEDES',
    description:
      'The March coordination law was followed by the April law introducing Reich governors.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-civil-service-ancestry',
    sourceEventId: 'de-1933-civil-service-law',
    targetEventId: 'de-1933-aryan-paragraph-decree',
    type: 'PRECEDES',
    description:
      'The Civil Service Law was followed by implementing rules defining discriminatory ancestry criteria.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-mayday-unions',
    sourceEventId: 'de-1933-may-day-state-holiday',
    targetEventId: 'de-1933-free-trade-unions-dismantled',
    type: 'PRECEDES',
    description:
      'The state-sponsored May Day observance immediately preceded the destruction of independent trade-union organizations.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-unions-labor-front',
    sourceEventId: 'de-1933-free-trade-unions-dismantled',
    targetEventId: 'de-1933-german-labor-front',
    type: 'CONTRIBUTES_TO',
    description:
      'The dismantling of independent unions cleared the institutional space for the regime-controlled German Labor Front.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-spd-one-party',
    sourceEventId: 'de-1933-spd-banned',
    targetEventId: 'de-1933-one-party-state',
    type: 'CONTRIBUTES_TO',
    description:
      'The prohibition of the SPD formed part of the elimination of political pluralism that culminated in the legal one-party state.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-party-dissolutions-one-party',
    sourceEventId: 'de-1933-center-party-dissolves',
    targetEventId: 'de-1933-one-party-state',
    type: 'CONTRIBUTES_TO',
    description:
      'The dissolution of remaining parties preceded legislation making the Nazi Party the only legal political party.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-one-party-single-list',
    sourceEventId: 'de-1933-one-party-state',
    targetEventId: 'de-1933-november-single-list-election',
    type: 'CONTRIBUTES_TO',
    description:
      'The one-party system formed the political context for the November single-list Reichstag election.',
    status: 'PUBLISHED',
  }),
  createEventConnection({
    id: 'de-1933-link-league-geneva',
    sourceEventId: 'de-1933-league-withdrawal-announced',
    targetEventId: 'de-1933-geneva-disarmament-exit',
    type: 'RELATED',
    description:
      'The League withdrawal announcement and departure from the Geneva disarmament talks were announced together as linked foreign-policy moves.',
    status: 'PUBLISHED',
  }),
];

export function getGermany1933EventConnections(): EventConnection[] {
  return [...GERMANY_1933_EVENT_CONNECTIONS];
}
