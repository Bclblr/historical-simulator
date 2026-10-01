import type { HistoricalSource } from './source';

export type SourceVerificationStatus =
  | 'UNREVIEWED'
  | 'METADATA_CHECKED'
  | 'SOURCE_LOCATED'
  | 'CROSS_CHECKED'
  | 'VERIFIED';

export interface SourceVerification {
  sourceId: HistoricalSource['id'];
  status: SourceVerificationStatus;
  checkedBy: string | null;
  checkedAt: string | null;
  notes: string[];
}

export function createSourceVerification(
  source: HistoricalSource,
  status: SourceVerificationStatus = 'UNREVIEWED',
  checkedBy?: string | null,
  checkedAt?: string | null,
  notes: string[] = [],
): SourceVerification {
  const normalizedCheckedBy = checkedBy?.trim() || null;
  const normalizedCheckedAt = checkedAt?.trim() || null;

  if (status === 'VERIFIED' && (!normalizedCheckedBy || !normalizedCheckedAt)) {
    throw new Error(
      'Verified sources require both checkedBy and checkedAt metadata.',
    );
  }

  return {
    sourceId: source.id,
    status,
    checkedBy: normalizedCheckedBy,
    checkedAt: normalizedCheckedAt,
    notes: [...new Set(notes.map((note) => note.trim()).filter(Boolean))],
  };
}

export function isSourceVerified(
  verification: SourceVerification,
): boolean {
  return verification.status === 'VERIFIED';
}
