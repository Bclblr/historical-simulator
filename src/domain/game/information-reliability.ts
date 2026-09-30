import type { HistoricalEntityId } from '@/domain/history';

export type InformationReliability =
  | 'UNKNOWN'
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export interface InformationAssessment {
  id: string;
  subjectId: HistoricalEntityId;
  perspectiveInstitutionId: HistoricalEntityId;
  reliability: InformationReliability;
  rationale: string;
}

export interface CreateInformationAssessmentInput {
  id: string;
  subjectId: HistoricalEntityId;
  perspectiveInstitutionId: HistoricalEntityId;
  reliability?: InformationReliability;
  rationale?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

export function createInformationAssessment(
  input: CreateInformationAssessmentInput,
): InformationAssessment {
  return {
    id: required(input.id, 'InformationAssessment id'),
    subjectId: required(input.subjectId, 'InformationAssessment subjectId'),
    perspectiveInstitutionId: required(
      input.perspectiveInstitutionId,
      'InformationAssessment perspectiveInstitutionId',
    ),
    reliability: input.reliability ?? 'UNKNOWN',
    rationale: input.rationale?.trim() ?? '',
  };
}

export function updateInformationReliability(
  assessment: InformationAssessment,
  reliability: InformationReliability,
  rationale = assessment.rationale,
): InformationAssessment {
  return {
    ...assessment,
    reliability,
    rationale: rationale.trim(),
  };
}

export function getInformationAssessment(
  assessments: InformationAssessment[],
  subjectId: HistoricalEntityId,
  perspectiveInstitutionId: HistoricalEntityId,
): InformationAssessment | null {
  return (
    assessments.find(
      (assessment) =>
        assessment.subjectId === subjectId &&
        assessment.perspectiveInstitutionId === perspectiveInstitutionId,
    ) ?? null
  );
}
