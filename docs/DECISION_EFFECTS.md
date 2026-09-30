# Decision Effects

Milestone 29 introduces deterministic effects that can be applied to GameState after a DecisionOption is selected.

## Initial effect types

- SET_VARIABLE: set a numeric state variable.
- CHANGE_VARIABLE: increment or decrement a numeric state variable.
- ADVANCE_DAYS: move the simulation chronology by an integer number of days.

Effects are applied in authored order. Every operation returns a new GameState and does not mutate the input object.

## Boundaries

This milestone defines generic effect execution only.

- hidden-variable semantics and visibility rules belong to milestone 30;
- flag-specific gameplay rules belong to milestone 31;
- decision history belongs to milestone 32;
- delayed effects belong to milestone 34.

## Historical integrity

A gameplay effect represents simulation state, not evidence that an alternate outcome happened historically. Historical content classification remains separate from GameState changes.

The engine contains no ideology-, country- or regime-specific effect names. Content packs provide scenario-specific variable keys and values.
