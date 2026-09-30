import type { HistoricalEntityId } from '@/domain/history';

export type InformationVisibility =
  | 'PUBLIC'
  | 'INSTITUTION'
  | 'RESTRICTED'
  | 'HIDDEN';

export interface InformationAccessRule {
  subjectId: HistoricalEntityId;
  visibility: InformationVisibility;
  institutionIds: HistoricalEntityId[];
}

export interface CreateInformationAccessRuleInput {
  subjectId: HistoricalEntityId;
  visibility?: InformationVisibility;
  institutionIds?: HistoricalEntityId[];
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function normalizeIds(ids: HistoricalEntityId[] | undefined): HistoricalEntityId[] {
  return [...new Set((ids ?? []).map((id) => id.trim()).filter(Boolean))];
}

export function createInformationAccessRule(
  input: CreateInformationAccessRuleInput,
): InformationAccessRule {
  const visibility = input.visibility ?? 'PUBLIC';
  const institutionIds = normalizeIds(input.institutionIds);

  if (
    (visibility === 'INSTITUTION' || visibility === 'RESTRICTED') &&
    institutionIds.length === 0
  ) {
    throw new Error(
      `InformationAccessRule ${visibility} visibility requires at least one institution.`,
    );
  }

  return {
    subjectId: required(input.subjectId, 'InformationAccessRule subjectId'),
    visibility,
    institutionIds,
  };
}

export function canInstitutionAccessInformation(
  rule: InformationAccessRule,
  institutionId: HistoricalEntityId,
): boolean {
  switch (rule.visibility) {
    case 'PUBLIC':
      return true;
    case 'INSTITUTION':
    case 'RESTRICTED':
      return rule.institutionIds.includes(institutionId);
    case 'HIDDEN':
      return false;
  }
}

export function filterAccessibleInformation<T>(
  items: T[],
  getSubjectId: (item: T) => HistoricalEntityId,
  rules: InformationAccessRule[],
  institutionId: HistoricalEntityId,
): T[] {
  const rulesBySubject = new Map(rules.map((rule) => [rule.subjectId, rule]));

  return items.filter((item) => {
    const rule = rulesBySubject.get(getSubjectId(item));
    return rule
      ? canInstitutionAccessInformation(rule, institutionId)
      : true;
  });
}
