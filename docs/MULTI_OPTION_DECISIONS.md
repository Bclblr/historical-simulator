# Multi-option Decisions

Milestone 28 removes the two-choice limitation while preserving optional LEFT/RIGHT shortcuts.

## Model

A single event may expose any number of DecisionOptions.

- at most one option may be bound to LEFT;
- at most one option may be bound to RIGHT;
- any number of additional options may have swipeDirection = null and be presented as buttons, menu entries or another explicit UI control.

## Validation

validateDecisionOptions ensures:
- every option belongs to the same event;
- option IDs are unique;
- LEFT and RIGHT bindings are unambiguous.

getDecisionById resolves any option regardless of presentation method. getDirectDecisions returns options that are not attached to a swipe gesture.

## Separation of concerns

The domain does not require every event to have two choices, and it does not assign political or moral meaning to option ordering or gesture direction. Effects remain outside this milestone.
