# Local Database

Milestone: **8/100**

Historical Simulator uses `expo-sqlite` as its persistent local relational store.

## Startup

The root application mounts `SQLiteProvider`. On initialization:

1. WAL journal mode is enabled.
2. Foreign keys are enabled.
3. `PRAGMA user_version` is read.
4. Pending migrations are applied in version order.
5. Each migration is executed inside an exclusive transaction.
6. The resulting schema version is validated.

## Version 1 schema

Historical content foundation:

- `eras`
- `countries`
- `institutions`
- `historical_roles`

Player-state foundation:

- `game_sessions`

Later milestones add events, documents, sources, decisions, effects, discoveries and delayed consequences.

## Rules

- Routes/components do not issue SQL.
- SQL stays under the data layer.
- User values are bound through query parameters in repository implementations.
- `execAsync` is reserved for trusted static migration SQL.
- Schema changes require a new numbered migration.
- Stable string IDs are used for historical entities.
- Multi-write gameplay operations should use transactions.
- The database is local-first; a future cloud layer must not become the source of truth for offline play.

## Why WAL

Expo recommends enabling WAL for general performance. The database also enables foreign-key enforcement on initialization.
