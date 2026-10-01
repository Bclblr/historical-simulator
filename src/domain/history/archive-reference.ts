export interface ArchiveReference {
  archiveName: string;
  collection: string | null;
  series: string | null;
  boxOrFile: string | null;
  item: string | null;
}

export interface CreateArchiveReferenceInput {
  archiveName: string;
  collection?: string | null;
  series?: string | null;
  boxOrFile?: string | null;
  item?: string | null;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function optional(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

export function createArchiveReference(
  input: CreateArchiveReferenceInput,
): ArchiveReference {
  return {
    archiveName: required(input.archiveName, 'ArchiveReference archiveName'),
    collection: optional(input.collection),
    series: optional(input.series),
    boxOrFile: optional(input.boxOrFile),
    item: optional(input.item),
  };
}

export function formatArchiveReference(reference: ArchiveReference): string {
  return [
    reference.archiveName,
    reference.collection,
    reference.series,
    reference.boxOrFile,
    reference.item,
  ]
    .filter((part): part is string => Boolean(part))
    .join(', ');
}
