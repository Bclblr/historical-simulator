import type { HistoricalEntityId } from '@/domain/history';
import type { InstitutionAction } from './institution-action';

export type InstitutionalOutcomeKind =
  | 'INFLUENCE_CHANGE'
  | 'RELATIONSHIP_CHANGE'
  | 'CONFLICT_CHANGE'
  | 'FLAG'
  | 'OTHER';

export interface InstitutionalOutcome {
  id: string;
  sourceActionId: string | null;
  institutionId: HistoricalEntityId;
  kind: InstitutionalOutcomeKind;
  subject: string;
  value: number;
  note: string;
}

export interface CreateInstitutionalOutcomeInput {
  id: string;
  sourceActionId?: string | null;
  institutionId: HistoricalEntityId;
  kind: InstitutionalOutcomeKind;
  subject: string;
  value?: number;
  note?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createInstitutionalOutcome(
  input: CreateInstitutionalOutcomeInput,
  actions: InstitutionAction[] = [],
): InstitutionalOutcome {
  const sourceActionId = input.sourceActionId?.trim() || null;

  if (
    sourceActionId &&
    !actions.some((action) => action.id === sourceActionId)
  ) {
    throw new Error('InstitutionalOutcome source action was not found.');
  }

  const value = input.value ?? 0;
  if (!Number.isFinite(value)) {
    throw new Error('InstitutionalOutcome value must be finite.');
  }

  return {
    id: required(input.id, 'InstitutionalOutcome id'),
    sourceActionId,
    institutionId: required(
      input.institutionId,
      'InstitutionalOutcome institutionId',
    ),
    kind: input.kind,
    subject: required(input.subject, 'InstitutionalOutcome subject'),
    value,
    note: input.note?.trim() ?? '',
  };
}

export function getInstitutionalOutcomes(
  outcomes: InstitutionalOutcome[],
  institutionId: HistoricalEntityId,
): InstitutionalOutcome[] {
  return outcomes.filter(
    (outcome) => outcome.institutionId === institutionId,
  );
}

export function getActionOutcomes(
  outcomes: InstitutionalOutcome[],
  actionId: string,
): InstitutionalOutcome[] {
  return outcomes.filter((outcome) => outcome.sourceActionId === actionId);
}
