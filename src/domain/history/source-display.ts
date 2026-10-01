import type { HistoricalEntityId } from './types';
import type { HistoricalCitation } from './citation';
import type { HistoricalSource } from './source';

export interface SourceDisplay {
  citationId: HistoricalEntityId;
  sourceId: HistoricalEntityId;
  title: string;
  contributors: string[];
  publicationYear: number | null;
  sourceType: HistoricalSource['type'];
  confidence: HistoricalSource['confidence'];
  locator: string | null;
  note: string | null;
  url: string | null;
  doi: string | null;
}

export function createSourceDisplay(
  citation: HistoricalCitation,
  sources: HistoricalSource[],
): SourceDisplay {
  const source = sources.find((candidate) => candidate.id === citation.sourceId);

  if (!source) {
    throw new Error('SourceDisplay citation source was not found.');
  }

  return {
    citationId: citation.id,
    sourceId: source.id,
    title: source.title,
    contributors:
      source.authors.length > 0 ? [...source.authors] : [...source.editors],
    publicationYear: source.publicationYear,
    sourceType: source.type,
    confidence: source.confidence,
    locator: citation.locator,
    note: citation.note,
    url: source.url,
    doi: source.doi,
  };
}

export function getSourceDisplaysForTarget(
  citations: HistoricalCitation[],
  sources: HistoricalSource[],
  targetId: HistoricalEntityId,
): SourceDisplay[] {
  return citations
    .filter((citation) => citation.targetId === targetId)
    .map((citation) => createSourceDisplay(citation, sources));
}
