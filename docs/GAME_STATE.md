# GameState

GameState is the serializable domain snapshot of one simulation session.

## Current responsibilities

- stable session ID;
- current in-game date;
- selected era, country, institution and role perspective;
- boolean flags;
- numeric simulation variables.

The model is intentionally small. Decision history, delayed consequences and event-engine runtime data are introduced in their dedicated roadmap milestones rather than being prematurely embedded here.

## Invariants

- sessionId and all selection IDs are non-empty.
- currentDate is a valid YYYY-MM-DD value for the current modern-era implementation.
- flag keys are normalized non-empty strings.
- variable keys are normalized non-empty strings.
- variable values must be finite numbers.
- update helpers return new GameState objects rather than mutating existing state.

## Persistence compatibility

The current shape remains compatible with the existing game_sessions table and SQLiteGameSessionRepository. No migration is required for milestone 21.

## Historical date limitation

The current YYYY-MM-DD representation is suitable for the initial 1933 vertical slice but is not sufficient as the final representation for BCE/ancient eras. Milestone 22 must introduce a historical date abstraction before ancient-era content is added.
