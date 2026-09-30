# Decision History

Milestone 32 introduces explicit memory of previous player decisions.

## Record

Each DecisionRecord stores:
- source event ID;
- selected option ID;
- historical simulation date when the choice was made;
- monotonically increasing sequence number.

The record deliberately stores stable IDs rather than copied labels or descriptions.

## Queries

- hasDecisionForEvent checks whether an event has been decided before.
- wasDecisionSelected checks a specific event/option pair.
- getLatestDecisionForEvent returns the most recent recorded choice for an event.

## Boundaries

Decision history is simulation history, not historical evidence. A player choice must never be presented as something that happened in real history.

Milestone 32 defines the domain memory model only. Event eligibility consumes previous decisions in milestone 33, and durable SQLite save/load integration belongs to milestone 35.
