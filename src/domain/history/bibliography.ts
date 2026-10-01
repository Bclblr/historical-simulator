import type { HistoricalEntityId } from './types';
import type { HistoricalSource } from './source';
import { getSourceCategory, type SourceCategory } from './source-category';

export interface BibliographyEntry {
  sourceId: HistoricalEntityId;
  category: SourceCategory;
  contributors: string[];
  title: string;
  publicationYear: number | null;
  publisher: string | null;
  journalOrCollection: string | null;
  volume: string | null;
  issue: string | null;
  doi: string | null;
  url: string | null;
}

export function createBibliographyEntry(
  source: HistoricalSource,
): BibliographyEntry {
  return {
    sourceId: source.id,
    category: getSourceCategory(source.type),
    contributors:
      source.authors.length > 0 ? [...source.authors] : [...source.editors],
    title: source.title,
    publicationYear: source.publicationYear,
    publisher: source.publisher,
    journalOrCollection: source.journalOrCollection,
    volume: source.volume,
    issue: source.issue,
    doi: source.doi,
    url: source.url,
  };
}

export function createBibliography(
  sources: HistoricalSource[],
): BibliographyEntry[] {
  const uniqueSources = new Map<HistoricalEntityId, HistoricalSource>();

  for (const source of sources) {
    if (!uniqueSources.has(source.id)) {
      uniqueSources.set(source.id, source);
    }
  }

  return [...uniqueSources.values()]
    .map(createBibliographyEntry)
    .sort((a, b) => {
      const firstContributorA = a.contributors[0] ?? '';
      const firstContributorB = b.contributors[0] ?? '';
      const contributorOrder = firstContributorA.localeCompare(firstContributorB);

      if (contributorOrder !== 0) return contributorOrder;

      const yearA = a.publicationYear ?? Number.MAX_SAFE_INTEGER;
      const yearB = b.publicationYear ?? Number.MAX_SAFE_INTEGER;
      if (yearA !== yearB) return yearA - yearB;

      return a.title.localeCompare(b.title);
    });
}
