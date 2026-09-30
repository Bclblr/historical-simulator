import type {
  HistoricalContentClassification,
  HistoricalEntityId,
  HistoricalEvent,
  HistoricalEventScope,
} from '@/domain/history';
import type { GameState } from './types';
import { getEligibleEvents, getNextEligibleEvent } from './event-engine';

export interface GameCard {
  id: string;
  eventId: HistoricalEntityId;
  title: string;
  body: string;
  date: string;
  scope: HistoricalEventScope;
  classification: HistoricalContentClassification;
  relatedCountryIds: HistoricalEntityId[];
  relatedInstitutionIds: HistoricalEntityId[];
  relatedPersonIds: HistoricalEntityId[];
}

export function createGameCardFromEvent(event: HistoricalEvent): GameCard {
  return {
    id: `event-card:${event.id}`,
    eventId: event.id,
    title: event.title,
    body: event.summary,
    date: event.startDate,
    scope: event.scope,
    classification: event.classification,
    relatedCountryIds: [...event.countryIds],
    relatedInstitutionIds: [...event.institutionIds],
    relatedPersonIds: [...event.personIds],
  };
}

export function generateEligibleCards(
  events: HistoricalEvent[],
  state: GameState,
): GameCard[] {
  return getEligibleEvents(events, state).map(createGameCardFromEvent);
}

export function generateNextCard(
  events: HistoricalEvent[],
  state: GameState,
): GameCard | null {
  const event = getNextEligibleEvent(events, state);
  return event ? createGameCardFromEvent(event) : null;
}
