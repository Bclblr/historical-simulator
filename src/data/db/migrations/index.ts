import { migration001 } from './001-initial';
import { migration002 } from './002-session-runtime';

export const migrations = [migration001, migration002] as const;
