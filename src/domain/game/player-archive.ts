import type { GameSessionSnapshot } from '@/domain/game';
import type { HistoricalEvent } from '@/domain/history';

export interface PlayerArchive {
  sessionId: string;
  currentDate: string;
  discoveredEventIds: string[];
  decisionsRecorded: number;
}

export function getDiscoveredEvents(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
): HistoricalEvent[] {
  const decided = new Set(snapshot.decisionHistory.map((record) => record.eventId));

  return events.filter(
    (event) =>
      event.startDate <= snapshot.state.currentDate || decided.has(event.id),
  );
}

export function createPlayerArchive(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
): PlayerArchive {
  const discoveredEvents = getDiscoveredEvents(snapshot, events);

  return {
    sessionId: snapshot.state.sessionId,
    currentDate: snapshot.state.currentDate,
    discoveredEventIds: discoveredEvents.map((event) => event.id),
    decisionsRecorded: snapshot.decisionHistory.length,
  };
}
