import type { HistoricalEntityId } from '@/domain/history';

export type InstitutionRelationshipKind =
  | 'COOPERATIVE'
  | 'COMPETITIVE'
  | 'DEPENDENT'
  | 'SUPERVISORY'
  | 'NEUTRAL'
  | 'OTHER';

export interface InstitutionRelationship {
  id: string;
  sourceInstitutionId: HistoricalEntityId;
  targetInstitutionId: HistoricalEntityId;
  kind: InstitutionRelationshipKind;
  influence: number;
  note: string;
}

export interface CreateInstitutionRelationshipInput {
  id: string;
  sourceInstitutionId: HistoricalEntityId;
  targetInstitutionId: HistoricalEntityId;
  kind?: InstitutionRelationshipKind;
  influence?: number;
  note?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function assertInfluence(value: number): number {
  if (!Number.isFinite(value) || value < -100 || value > 100) {
    throw new Error('InstitutionRelationship influence must be between -100 and 100.');
  }
  return value;
}

export function createInstitutionRelationship(
  input: CreateInstitutionRelationshipInput,
): InstitutionRelationship {
  const sourceInstitutionId = required(
    input.sourceInstitutionId,
    'InstitutionRelationship sourceInstitutionId',
  );
  const targetInstitutionId = required(
    input.targetInstitutionId,
    'InstitutionRelationship targetInstitutionId',
  );

  if (sourceInstitutionId === targetInstitutionId) {
    throw new Error('InstitutionRelationship must connect two different institutions.');
  }

  return {
    id: required(input.id, 'InstitutionRelationship id'),
    sourceInstitutionId,
    targetInstitutionId,
    kind: input.kind ?? 'NEUTRAL',
    influence: assertInfluence(input.influence ?? 0),
    note: input.note?.trim() ?? '',
  };
}

export function updateInstitutionRelationshipInfluence(
  relationship: InstitutionRelationship,
  change: number,
): InstitutionRelationship {
  if (!Number.isFinite(change)) {
    throw new Error('InstitutionRelationship influence change must be finite.');
  }

  const influence = Math.max(-100, Math.min(100, relationship.influence + change));
  return { ...relationship, influence };
}

export function getOutgoingInstitutionRelationships(
  relationships: InstitutionRelationship[],
  institutionId: HistoricalEntityId,
): InstitutionRelationship[] {
  return relationships.filter(
    (relationship) => relationship.sourceInstitutionId === institutionId,
  );
}

export function getInstitutionRelationship(
  relationships: InstitutionRelationship[],
  sourceInstitutionId: HistoricalEntityId,
  targetInstitutionId: HistoricalEntityId,
): InstitutionRelationship | null {
  return (
    relationships.find(
      (relationship) =>
        relationship.sourceInstitutionId === sourceInstitutionId &&
        relationship.targetInstitutionId === targetInstitutionId,
    ) ?? null
  );
}
