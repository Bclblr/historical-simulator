import type { HistoricalEntityId } from '@/domain/history';
import { parseHistoricalDate } from './historical-date';

export type PositionAssignmentStatus = 'PLANNED' | 'ACTIVE' | 'ENDED';

export interface PositionAssignment {
  id: string;
  institutionId: HistoricalEntityId;
  roleId: HistoricalEntityId;
  personId: HistoricalEntityId | null;
  startDate: string;
  endDate: string | null;
  status: PositionAssignmentStatus;
  note: string;
}

export interface CreatePositionAssignmentInput {
  id: string;
  institutionId: HistoricalEntityId;
  roleId: HistoricalEntityId;
  personId?: HistoricalEntityId | null;
  startDate: string;
  endDate?: string | null;
  status?: PositionAssignmentStatus;
  note?: string;
}

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${field} is required.`);
  return normalized;
}

function optionalId(value: HistoricalEntityId | null | undefined): HistoricalEntityId | null {
  return value?.trim() || null;
}

export function createPositionAssignment(
  input: CreatePositionAssignmentInput,
): PositionAssignment {
  parseHistoricalDate(input.startDate);
  const endDate = input.endDate?.trim() || null;

  if (endDate) {
    parseHistoricalDate(endDate);
    if (endDate < input.startDate) {
      throw new Error('PositionAssignment endDate cannot be before startDate.');
    }
  }

  return {
    id: required(input.id, 'PositionAssignment id'),
    institutionId: required(
      input.institutionId,
      'PositionAssignment institutionId',
    ),
    roleId: required(input.roleId, 'PositionAssignment roleId'),
    personId: optionalId(input.personId),
    startDate: input.startDate,
    endDate,
    status: input.status ?? 'PLANNED',
    note: input.note?.trim() ?? '',
  };
}

export function isPositionAssignmentActiveOn(
  assignment: PositionAssignment,
  date: string,
): boolean {
  parseHistoricalDate(date);
  return (
    assignment.status === 'ACTIVE' &&
    assignment.startDate <= date &&
    (assignment.endDate === null || assignment.endDate >= date)
  );
}

export function getActivePositionAssignments(
  assignments: PositionAssignment[],
  institutionId: HistoricalEntityId,
  date: string,
): PositionAssignment[] {
  return assignments.filter(
    (assignment) =>
      assignment.institutionId === institutionId &&
      isPositionAssignmentActiveOn(assignment, date),
  );
}

export function endPositionAssignment(
  assignment: PositionAssignment,
  endDate: string,
): PositionAssignment {
  parseHistoricalDate(endDate);
  if (endDate < assignment.startDate) {
    throw new Error('PositionAssignment endDate cannot be before startDate.');
  }

  return { ...assignment, endDate, status: 'ENDED' };
}
