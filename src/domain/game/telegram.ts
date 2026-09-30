import type { HistoricalDocument, HistoricalEntityId } from '@/domain/history';
import { parseHistoricalDate } from './historical-date';

export type TelegramDeliveryStatus = 'QUEUED' | 'DELIVERED' | 'READ';

export interface Telegram {
  id: string;
  documentId: HistoricalEntityId;
  senderInstitutionId: HistoricalEntityId;
  recipientInstitutionId: HistoricalEntityId;
  deliveredAt: string | null;
  status: TelegramDeliveryStatus;
}

export interface CreateTelegramInput {
  id: string;
  documentId: HistoricalEntityId;
  senderInstitutionId: HistoricalEntityId;
  recipientInstitutionId: HistoricalEntityId;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createTelegram(input: CreateTelegramInput): Telegram {
  return {
    id: required(input.id, 'Telegram id'),
    documentId: required(input.documentId, 'Telegram documentId'),
    senderInstitutionId: required(input.senderInstitutionId, 'Telegram senderInstitutionId'),
    recipientInstitutionId: required(input.recipientInstitutionId, 'Telegram recipientInstitutionId'),
    deliveredAt: null,
    status: 'QUEUED',
  };
}

export function assertTelegramDocument(
  telegram: Telegram,
  document: HistoricalDocument,
): void {
  if (telegram.documentId !== document.id) {
    throw new Error('Telegram document reference does not match.');
  }
  if (document.type !== 'TELEGRAM') {
    throw new Error('Telegram must reference a TELEGRAM HistoricalDocument.');
  }
}

export function deliverTelegram(
  telegram: Telegram,
  deliveredAt: string,
): Telegram {
  parseHistoricalDate(deliveredAt);
  return { ...telegram, deliveredAt, status: 'DELIVERED' };
}

export function markTelegramRead(telegram: Telegram): Telegram {
  if (telegram.status === 'QUEUED') {
    throw new Error('A queued telegram cannot be read before delivery.');
  }
  return { ...telegram, status: 'READ' };
}

export function getUnreadTelegrams(
  telegrams: Telegram[],
  recipientInstitutionId: HistoricalEntityId,
): Telegram[] {
  return telegrams.filter(
    (telegram) =>
      telegram.recipientInstitutionId === recipientInstitutionId &&
      telegram.status === 'DELIVERED',
  );
}
