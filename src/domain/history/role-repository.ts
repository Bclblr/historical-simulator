import type {
  HistoricalRole,
  HistoricalRoleStatus,
  HistoricalRoleType,
} from './role';
import type { HistoricalEntityId } from './types';

export interface HistoricalRoleListFilter {
  status?: HistoricalRoleStatus;
  type?: HistoricalRoleType;
  parentRoleId?: HistoricalEntityId | null;
}

export interface HistoricalRoleRepository {
  findById(id: HistoricalEntityId): Promise<HistoricalRole | null>;
  listByInstitution(
    institutionId: HistoricalEntityId,
    filter?: HistoricalRoleListFilter,
  ): Promise<HistoricalRole[]>;
  save(role: HistoricalRole): Promise<void>;
}
