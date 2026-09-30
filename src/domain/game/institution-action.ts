import type { HistoricalEntityId } from '@/domain/history';
import { parseHistoricalDate } from './historical-date';
import {
  hasInstitutionalAuthority,
  type InstitutionalAuthorityGrant,
} from './institution-authority';
import type { GamePerspective } from './perspective';

export type InstitutionActionKind = 'REQUEST' | 'DIRECTIVE';
export type InstitutionActionStatus =
  | 'ISSUED'
  | 'ACKNOWLEDGED'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED';

export interface InstitutionAction {
  id: string;
  senderInstitutionId: HistoricalEntityId;
  senderRoleId: HistoricalEntityId;
  recipientInstitutionId: HistoricalEntityId;
  kind: InstitutionActionKind;
  subject: string;
  issuedAt: string;
  status: InstitutionActionStatus;
  note: string;
}

export interface CreateInstitutionActionInput {
  id: string;
  senderInstitutionId: HistoricalEntityId;
  senderRoleId: HistoricalEntityId;
  recipientInstitutionId: HistoricalEntityId;
  kind: InstitutionActionKind;
  subject: string;
  issuedAt: string;
  note?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createInstitutionAction(
  input: CreateInstitutionActionInput,
  grants: InstitutionalAuthorityGrant[],
): InstitutionAction {
  parseHistoricalDate(input.issuedAt);
  const senderInstitutionId = required(input.senderInstitutionId, 'InstitutionAction senderInstitutionId');
  const senderRoleId = required(input.senderRoleId, 'InstitutionAction senderRoleId');
  const recipientInstitutionId = required(input.recipientInstitutionId, 'InstitutionAction recipientInstitutionId');
  const subject = required(input.subject, 'InstitutionAction subject');

  const perspective: GamePerspective = {
    eraId: 'authority-check',
    countryId: 'authority-check',
    institutionId: senderInstitutionId,
    roleId: senderRoleId,
  };
  const action = input.kind === 'DIRECTIVE' ? 'DIRECT' : 'REQUEST';

  if (!hasInstitutionalAuthority(perspective, grants, action, subject)) {
    throw new Error(`InstitutionAction requires ${action} authority for this subject.`);
  }

  return {
    id: required(input.id, 'InstitutionAction id'),
    senderInstitutionId,
    senderRoleId,
    recipientInstitutionId,
    kind: input.kind,
    subject,
    issuedAt: input.issuedAt,
    status: 'ISSUED',
    note: input.note?.trim() ?? '',
  };
}

export function updateInstitutionActionStatus(
  action: InstitutionAction,
  status: InstitutionActionStatus,
): InstitutionAction {
  return { ...action, status };
}

export function getInstitutionActionInbox(
  actions: InstitutionAction[],
  institutionId: HistoricalEntityId,
): InstitutionAction[] {
  return actions
    .filter((action) => action.recipientInstitutionId === institutionId)
    .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
}
