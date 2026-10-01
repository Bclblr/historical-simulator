import type { DecisionRecord, GameSessionSnapshot } from '@/domain/game';
import type { HistoricalDocument, HistoricalEvent } from '@/domain/history';

export interface PlayerArchive {
  sessionId: string;
  currentDate: string;
  discoveredEventIds: string[];
  discoveredDocumentIds: string[];
  decisionsRecorded: number;
}

export interface ArchiveStatistics {
  totalEvents: number;
  discoveredEvents: number;
  discoveredDocuments: number;
  decisionsRecorded: number;
  historicalProgressPercent: number;
}

export interface ArchiveTimelineComparison {
  historical: ArchiveTimelineEntry[];
  player: ArchiveTimelineEntry[];
}

export interface ArchiveTimelineEntry {
  id: string;
  date: string;
  kind: 'EVENT' | 'DECISION';
  eventId: string;
  title: string;
  optionId: string | null;
}

export function getDiscoveredEvents(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
): HistoricalEvent[] {
  const decided = new Set(snapshot.decisionHistory.map((record) => record.eventId));
  return events.filter(
    (event) => event.startDate <= snapshot.state.currentDate || decided.has(event.id),
  );
}

export function getDiscoveredDocuments(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
  documents: HistoricalDocument[],
): HistoricalDocument[] {
  const discoveredEventIds = new Set(
    getDiscoveredEvents(snapshot, events).map((event) => event.id),
  );
  return documents.filter(
    (document) =>
      document.status === 'PUBLISHED' &&
      document.eventIds.some((eventId) => discoveredEventIds.has(eventId)),
  );
}

export function getDecisionHistory(
  snapshot: GameSessionSnapshot,
): DecisionRecord[] {
  return [...snapshot.decisionHistory].sort((a, b) => a.sequence - b.sequence);
}

export function createArchiveTimeline(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
): ArchiveTimelineEntry[] {
  const eventById = new Map(events.map((event) => [event.id, event]));
  const historical = getDiscoveredEvents(snapshot, events).map((event) => ({
    id: `event:${event.id}`,
    date: event.startDate,
    kind: 'EVENT' as const,
    eventId: event.id,
    title: event.title,
    optionId: null,
  }));
  const decisions = getDecisionHistory(snapshot).map((decision) => ({
    id: `decision:${decision.sequence}`,
    date: decision.decidedAt,
    kind: 'DECISION' as const,
    eventId: decision.eventId,
    title: eventById.get(decision.eventId)?.title ?? decision.eventId,
    optionId: decision.optionId,
  }));
  return [...historical, ...decisions].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );
}

export function createTimelineComparison(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
): ArchiveTimelineComparison {
  const timeline = createArchiveTimeline(snapshot, events);
  return {
    historical: timeline.filter((item) => item.kind === 'EVENT'),
    player: timeline.filter((item) => item.kind === 'DECISION'),
  };
}

export function createArchiveStatistics(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
  documents: HistoricalDocument[] = [],
): ArchiveStatistics {
  const discoveredEvents = getDiscoveredEvents(snapshot, events);
  const discoveredDocuments = getDiscoveredDocuments(snapshot, events, documents);
  const totalEvents = events.length;
  return {
    totalEvents,
    discoveredEvents: discoveredEvents.length,
    discoveredDocuments: discoveredDocuments.length,
    decisionsRecorded: snapshot.decisionHistory.length,
    historicalProgressPercent:
      totalEvents === 0 ? 0 : Math.round((discoveredEvents.length / totalEvents) * 100),
  };
}

export function createPlayerArchive(
  snapshot: GameSessionSnapshot,
  events: HistoricalEvent[],
  documents: HistoricalDocument[] = [],
): PlayerArchive {
  const discoveredEvents = getDiscoveredEvents(snapshot, events);
  const discoveredDocuments = getDiscoveredDocuments(snapshot, events, documents);
  return {
    sessionId: snapshot.state.sessionId,
    currentDate: snapshot.state.currentDate,
    discoveredEventIds: discoveredEvents.map((event) => event.id),
    discoveredDocumentIds: discoveredDocuments.map((document) => document.id),
    decisionsRecorded: snapshot.decisionHistory.length,
  };
}
