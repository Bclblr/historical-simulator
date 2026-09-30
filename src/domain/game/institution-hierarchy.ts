import type { HistoricalEntityId } from '@/domain/history';

export interface InstitutionHierarchyLink {
  id: string;
  superiorInstitutionId: HistoricalEntityId;
  superiorRoleId: HistoricalEntityId | null;
  subordinateInstitutionId: HistoricalEntityId;
  subordinateRoleId: HistoricalEntityId | null;
  subject: string;
}

export interface CreateInstitutionHierarchyLinkInput {
  id: string;
  superiorInstitutionId: HistoricalEntityId;
  superiorRoleId?: HistoricalEntityId | null;
  subordinateInstitutionId: HistoricalEntityId;
  subordinateRoleId?: HistoricalEntityId | null;
  subject: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function optionalId(value: HistoricalEntityId | null | undefined): HistoricalEntityId | null {
  return value?.trim() || null;
}

export function createInstitutionHierarchyLink(
  input: CreateInstitutionHierarchyLinkInput,
): InstitutionHierarchyLink {
  const superiorInstitutionId = required(
    input.superiorInstitutionId,
    'InstitutionHierarchyLink superiorInstitutionId',
  );
  const subordinateInstitutionId = required(
    input.subordinateInstitutionId,
    'InstitutionHierarchyLink subordinateInstitutionId',
  );
  const superiorRoleId = optionalId(input.superiorRoleId);
  const subordinateRoleId = optionalId(input.subordinateRoleId);

  if (
    superiorInstitutionId === subordinateInstitutionId &&
    superiorRoleId === subordinateRoleId
  ) {
    throw new Error('InstitutionHierarchyLink cannot point to itself.');
  }

  return {
    id: required(input.id, 'InstitutionHierarchyLink id'),
    superiorInstitutionId,
    superiorRoleId,
    subordinateInstitutionId,
    subordinateRoleId,
    subject: required(input.subject, 'InstitutionHierarchyLink subject'),
  };
}

export function getDirectSubordinates(
  links: InstitutionHierarchyLink[],
  institutionId: HistoricalEntityId,
  roleId: HistoricalEntityId | null = null,
): InstitutionHierarchyLink[] {
  return links.filter(
    (link) =>
      link.superiorInstitutionId === institutionId &&
      link.superiorRoleId === roleId,
  );
}

export function getDirectSuperiors(
  links: InstitutionHierarchyLink[],
  institutionId: HistoricalEntityId,
  roleId: HistoricalEntityId | null = null,
): InstitutionHierarchyLink[] {
  return links.filter(
    (link) =>
      link.subordinateInstitutionId === institutionId &&
      link.subordinateRoleId === roleId,
  );
}

export function isDirectSuperior(
  links: InstitutionHierarchyLink[],
  superiorInstitutionId: HistoricalEntityId,
  subordinateInstitutionId: HistoricalEntityId,
  subject?: string,
): boolean {
  return links.some(
    (link) =>
      link.superiorInstitutionId === superiorInstitutionId &&
      link.subordinateInstitutionId === subordinateInstitutionId &&
      (subject === undefined || link.subject === subject),
  );
}
