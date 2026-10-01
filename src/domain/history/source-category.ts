import type { HistoricalSource, SourceType } from './source';

export type SourceCategory = 'PRIMARY' | 'SECONDARY' | 'UNCLASSIFIED';

const PRIMARY_SOURCE_TYPES: ReadonlySet<SourceType> = new Set([
  'ARCHIVAL_RECORD',
  'PRIMARY_PUBLISHED',
]);

const SECONDARY_SOURCE_TYPES: ReadonlySet<SourceType> = new Set([
  'MONOGRAPH',
  'EDITED_VOLUME',
  'BOOK_CHAPTER',
  'JOURNAL_ARTICLE',
  'THESIS',
  'REFERENCE_WORK',
  'MUSEUM_OR_INSTITUTION',
]);

export function getSourceCategory(type: SourceType): SourceCategory {
  if (PRIMARY_SOURCE_TYPES.has(type)) return 'PRIMARY';
  if (SECONDARY_SOURCE_TYPES.has(type)) return 'SECONDARY';
  return 'UNCLASSIFIED';
}

export function isPrimarySource(source: HistoricalSource): boolean {
  return getSourceCategory(source.type) === 'PRIMARY';
}

export function isSecondarySource(source: HistoricalSource): boolean {
  return getSourceCategory(source.type) === 'SECONDARY';
}

export function groupSourcesByCategory(
  sources: HistoricalSource[],
): Record<SourceCategory, HistoricalSource[]> {
  return sources.reduce<Record<SourceCategory, HistoricalSource[]>>(
    (groups, source) => {
      groups[getSourceCategory(source.type)].push(source);
      return groups;
    },
    { PRIMARY: [], SECONDARY: [], UNCLASSIFIED: [] },
  );
}
