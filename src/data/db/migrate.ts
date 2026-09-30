import type { SQLiteDatabase } from 'expo-sqlite';
import { DATABASE_VERSION } from './constants';
import { migrations } from './migrations';

interface UserVersionRow {
  user_version: number;
}

export async function migrateDatabase(db: SQLiteDatabase): Promise<void> {
  await db.execAsync('PRAGMA journal_mode = WAL;');
  await db.execAsync('PRAGMA foreign_keys = ON;');

  const row = await db.getFirstAsync<UserVersionRow>('PRAGMA user_version');
  let currentVersion = row?.user_version ?? 0;

  if (currentVersion > DATABASE_VERSION) {
    throw new Error(
      `Database version ${currentVersion} is newer than supported version ${DATABASE_VERSION}.`,
    );
  }

  for (const migration of migrations) {
    if (migration.version <= currentVersion) continue;

    await db.withExclusiveTransactionAsync(async (tx) => {
      await migration.up(tx);
      await tx.execAsync(`PRAGMA user_version = ${migration.version};`);
    });

    currentVersion = migration.version;
  }

  if (currentVersion !== DATABASE_VERSION) {
    throw new Error(
      `Database migration incomplete. Expected ${DATABASE_VERSION}, received ${currentVersion}.`,
    );
  }
}
