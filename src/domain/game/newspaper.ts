import type { HistoricalDocument, HistoricalEntityId } from '@/domain/history';
import {
  compareHistoricalDates,
  parseHistoricalDate,
} from './historical-date';

export type NewspaperIssueStatus = 'UNAVAILABLE' | 'AVAILABLE' | 'READ';

export interface NewspaperIssue {
  id: string;
  documentId: HistoricalEntityId;
  publicationName: string;
  issueDate: string;
  availableFrom: string;
  status: NewspaperIssueStatus;
}

export interface CreateNewspaperIssueInput {
  id: string;
  documentId: HistoricalEntityId;
  publicationName: string;
  issueDate: string;
  availableFrom?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createNewspaperIssue(
  input: CreateNewspaperIssueInput,
): NewspaperIssue {
  parseHistoricalDate(input.issueDate);
  const availableFrom = input.availableFrom ?? input.issueDate;
  parseHistoricalDate(availableFrom);

  return {
    id: required(input.id, 'NewspaperIssue id'),
    documentId: required(input.documentId, 'NewspaperIssue documentId'),
    publicationName: required(input.publicationName, 'NewspaperIssue publicationName'),
    issueDate: input.issueDate,
    availableFrom,
    status: 'UNAVAILABLE',
  };
}

export function assertNewspaperDocument(
  issue: NewspaperIssue,
  document: HistoricalDocument,
): void {
  if (issue.documentId !== document.id) {
    throw new Error('NewspaperIssue document reference does not match.');
  }
  if (document.type !== 'NEWSPAPER') {
    throw new Error('NewspaperIssue must reference a NEWSPAPER HistoricalDocument.');
  }
}

export function updateNewspaperAvailability(
  issue: NewspaperIssue,
  currentDate: string,
): NewspaperIssue {
  const available =
    compareHistoricalDates(
      parseHistoricalDate(currentDate),
      parseHistoricalDate(issue.availableFrom),
    ) >= 0;

  if (!available || issue.status === 'READ') return issue;
  return { ...issue, status: 'AVAILABLE' };
}

export function markNewspaperRead(issue: NewspaperIssue): NewspaperIssue {
  if (issue.status === 'UNAVAILABLE') {
    throw new Error('An unavailable newspaper issue cannot be read.');
  }
  return { ...issue, status: 'READ' };
}

export function getAvailableNewspapers(
  issues: NewspaperIssue[],
  currentDate: string,
): NewspaperIssue[] {
  return issues
    .map((issue) => updateNewspaperAvailability(issue, currentDate))
    .filter((issue) => issue.status === 'AVAILABLE')
    .sort((a, b) =>
      compareHistoricalDates(
        parseHistoricalDate(b.issueDate),
        parseHistoricalDate(a.issueDate),
      ),
    );
}
