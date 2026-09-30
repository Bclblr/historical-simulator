import {
  getHistoricalContentLayer,
  type HistoricalContentLayer,
  type HistoricalDocument,
  type HistoricalEntityId,
} from '@/domain/history';

export type DocumentInspectionStatus = 'UNOPENED' | 'OPENED' | 'REVIEWED';

export interface DocumentInspection {
  documentId: HistoricalEntityId;
  status: DocumentInspectionStatus;
  progress: number;
}

export interface DocumentInspectionView {
  documentId: HistoricalEntityId;
  title: string;
  documentDate: string | null;
  type: HistoricalDocument['type'];
  language: string | null;
  summary: string;
  transcription: string;
  classification: HistoricalDocument['classification'];
  contentLayer: HistoricalContentLayer;
}

export function createDocumentInspection(
  documentId: HistoricalEntityId,
): DocumentInspection {
  const normalized = documentId.trim();
  if (!normalized) throw new Error('DocumentInspection documentId is required.');
  return { documentId: normalized, status: 'UNOPENED', progress: 0 };
}

export function openDocumentInspection(
  inspection: DocumentInspection,
): DocumentInspection {
  return {
    ...inspection,
    status: inspection.status === 'REVIEWED' ? 'REVIEWED' : 'OPENED',
  };
}

export function updateDocumentInspectionProgress(
  inspection: DocumentInspection,
  progress: number,
): DocumentInspection {
  if (!Number.isFinite(progress) || progress < 0 || progress > 1) {
    throw new Error('DocumentInspection progress must be between 0 and 1.');
  }
  return {
    ...inspection,
    progress,
    status: progress >= 1 ? 'REVIEWED' : 'OPENED',
  };
}

export function createDocumentInspectionView(
  document: HistoricalDocument,
): DocumentInspectionView {
  if (document.status !== 'PUBLISHED') {
    throw new Error('Only published historical documents may be inspected.');
  }

  return {
    documentId: document.id,
    title: document.title,
    documentDate: document.documentDate,
    type: document.type,
    language: document.language,
    summary: document.summary,
    transcription: document.transcription,
    classification: document.classification,
    contentLayer: getHistoricalContentLayer(document.classification),
  };
}
