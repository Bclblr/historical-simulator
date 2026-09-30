# Flag System

Milestone 31 defines the boolean state API used by the simulation engine.

## Semantics

A flag is a named boolean piece of simulation state. The engine does not attach historical, political or moral meaning to flag names.

Absent flags read as false by default unless a caller explicitly supplies another default.

## API

- getGameFlag reads a normalized flag key.
- setGameFlag immutably returns a GameState with the new value.
- matchesGameFlagCondition evaluates one expected boolean value.
- matchesAllGameFlagConditions requires every condition to match.
- matchesAnyGameFlagCondition requires at least one condition to match.

## Persistence

Flags continue to use the existing GameState flags record and flags_json SQLite column. No migration is required.

## Boundary

Milestone 31 provides flag storage and condition primitives only. Event eligibility does not consume flag conditions until milestone 33. Previous-decision memory is introduced separately in milestone 32.
