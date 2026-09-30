import type { HistoricalEntityId } from '@/domain/history';

export interface BureaucraticInfluence {
  institutionId: HistoricalEntityId;
  subject: string;
  value: number;
}

export interface CreateBureaucraticInfluenceInput {
  institutionId: HistoricalEntityId;
  subject: string;
  value?: number;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function normalizeInfluence(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error('BureaucraticInfluence value must be finite.');
  }
  return Math.max(0, Math.min(100, value));
}

export function createBureaucraticInfluence(
  input: CreateBureaucraticInfluenceInput,
): BureaucraticInfluence {
  return {
    institutionId: required(
      input.institutionId,
      'BureaucraticInfluence institutionId',
    ),
    subject: required(input.subject, 'BureaucraticInfluence subject'),
    value: normalizeInfluence(input.value ?? 0),
  };
}

export function changeBureaucraticInfluence(
  influence: BureaucraticInfluence,
  change: number,
): BureaucraticInfluence {
  if (!Number.isFinite(change)) {
    throw new Error('BureaucraticInfluence change must be finite.');
  }

  return {
    ...influence,
    value: normalizeInfluence(influence.value + change),
  };
}

export function getBureaucraticInfluence(
  influences: BureaucraticInfluence[],
  institutionId: HistoricalEntityId,
  subject: string,
): BureaucraticInfluence | null {
  return (
    influences.find(
      (influence) =>
        influence.institutionId === institutionId &&
        influence.subject === subject,
    ) ?? null
  );
}

export function getInfluencesForSubject(
  influences: BureaucraticInfluence[],
  subject: string,
): BureaucraticInfluence[] {
  return influences.filter((influence) => influence.subject === subject);
}
