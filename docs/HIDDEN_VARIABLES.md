# Hidden Variables

Milestone 30 separates a simulation variable's numeric value from whether the player is allowed to see it.

## Model

GameState continues to store only numeric values. Visibility is content/schema metadata represented by GameVariableDefinition:

- VISIBLE: may be exposed by player-facing UI.
- HIDDEN: may be used by the engine but must not be included by the visible-variable selector.

A definition also provides a finite defaultValue for sessions where a variable has not yet been written.

## API

- getGameVariableValue reads the stored value or the definition default.
- getVisibleGameVariables returns only VISIBLE definitions and their values.
- isGameVariableVisible provides an explicit visibility check.

## Persistence

No database migration is required. Existing variables_json save data remains compatible because visibility metadata is not session state.

## Boundary

Hidden variables are not secret historical facts. They are simulation mechanics. Historical evidence, source reliability and imperfect-information systems remain separate concerns.
