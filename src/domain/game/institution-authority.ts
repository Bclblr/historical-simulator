import type { HistoricalEntityId } from '@/domain/history';
import type { GamePerspective } from './perspective';

export type InstitutionalAuthorityAction =
  | 'VIEW'
  | 'ADVISE'
  | 'REQUEST'
  | 'APPROVE'
  | 'DIRECT'
  | 'OTHER';

export interface InstitutionalAuthorityGrant {
  institutionId: HistoricalEntityId;
  roleId: HistoricalEntityId;
  action: InstitutionalAuthorityAction;
  subject: string;
}

export interface CreateInstitutionalAuthorityGrantInput {
  institutionId: HistoricalEntityId;
  roleId: HistoricalEntityId;
  action: InstitutionalAuthorityAction;
  subject: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createInstitutionalAuthorityGrant(
  input: CreateInstitutionalAuthorityGrantInput,
): InstitutionalAuthorityGrant {
  return {
    institutionId: required(
      input.institutionId,
      'InstitutionalAuthorityGrant institutionId',
    ),
    roleId: required(input.roleId, 'InstitutionalAuthorityGrant roleId'),
    action: input.action,
    subject: required(input.subject, 'InstitutionalAuthorityGrant subject'),
  };
}

export function hasInstitutionalAuthority(
  perspective: GamePerspective,
  grants: InstitutionalAuthorityGrant[],
  action: InstitutionalAuthorityAction,
  subject: string,
): boolean {
  return grants.some(
    (grant) =>
      grant.institutionId === perspective.institutionId &&
      grant.roleId === perspective.roleId &&
      grant.action === action &&
      grant.subject === subject,
  );
}

export function getPerspectiveAuthority(
  perspective: GamePerspective,
  grants: InstitutionalAuthorityGrant[],
): InstitutionalAuthorityGrant[] {
  return grants.filter(
    (grant) =>
      grant.institutionId === perspective.institutionId &&
      grant.roleId === perspective.roleId,
  );
}
