import type { PropsWithChildren } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { DATABASE_NAME } from './constants';
import { migrateDatabase } from './migrate';

export function AppDatabaseProvider({ children }: PropsWithChildren) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDatabase}>
      {children}
    </SQLiteProvider>
  );
}
