import type { Era, EraStatus } from './era';
import type { HistoricalEntityId } from './types';

export interface EraRepository {
  findById(id: HistoricalEntityId): Promise<Era | null>;
  list(status?: EraStatus): Promise<Era[]>;
  save(era: Era): Promise<void>;
}
