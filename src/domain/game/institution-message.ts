import type { HistoricalEntityId } from '@/domain/history';
import { parseHistoricalDate } from './historical-date';

export type InstitutionMessageKind =
  | 'NOTICE'
  | 'REQUEST'
  | 'REPORT'
  | 'DIRECTIVE'
  | 'REPLY'
  | 'OTHER';

export type InstitutionMessageStatus = 'SENT' | 'DELIVERED' | 'READ';

export interface InstitutionMessage {
  id: string;
  senderInstitutionId: HistoricalEntityId;
  recipientInstitutionId: HistoricalEntityId;
  eventId: HistoricalEntityId | null;
  documentId: HistoricalEntityId | null;
  kind: InstitutionMessageKind;
  subject: string;
  body: string;
  sentAt: string;
  deliveredAt: string | null;
  status: InstitutionMessageStatus;
}

export interface CreateInstitutionMessageInput {
  id: string;
  senderInstitutionId: HistoricalEntityId;
  recipientInstitutionId: HistoricalEntityId;
  eventId?: HistoricalEntityId | null;
  documentId?: HistoricalEntityId | null;
  kind?: InstitutionMessageKind;
  subject: string;
  body?: string;
  sentAt: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createInstitutionMessage(
  input: CreateInstitutionMessageInput,
): InstitutionMessage {
  parseHistoricalDate(input.sentAt);

  return {
    id: required(input.id, 'InstitutionMessage id'),
    senderInstitutionId: required(
      input.senderInstitutionId,
      'InstitutionMessage senderInstitutionId',
    ),
    recipientInstitutionId: required(
      input.recipientInstitutionId,
      'InstitutionMessage recipientInstitutionId',
    ),
    eventId: input.eventId?.trim() || null,
    documentId: input.documentId?.trim() || null,
    kind: input.kind ?? 'NOTICE',
    subject: required(input.subject, 'InstitutionMessage subject'),
    body: input.body?.trim() ?? '',
    sentAt: input.sentAt,
    deliveredAt: null,
    status: 'SENT',
  };
}

export function deliverInstitutionMessage(
  message: InstitutionMessage,
  deliveredAt: string,
): InstitutionMessage {
  parseHistoricalDate(deliveredAt);
  if (deliveredAt < message.sentAt) {
    throw new Error('InstitutionMessage cannot be delivered before it is sent.');
  }
  return { ...message, deliveredAt, status: 'DELIVERED' };
}

export function markInstitutionMessageRead(
  message: InstitutionMessage,
): InstitutionMessage {
  if (message.status === 'SENT') {
    throw new Error('InstitutionMessage cannot be read before delivery.');
  }
  return { ...message, status: 'READ' };
}

export function getInstitutionInbox(
  messages: InstitutionMessage[],
  institutionId: HistoricalEntityId,
): InstitutionMessage[] {
  return messages
    .filter(
      (message) =>
        message.recipientInstitutionId === institutionId &&
        message.status !== 'SENT',
    )
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt));
}
