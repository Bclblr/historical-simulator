# Delayed Effects

Milestone 34 adds deterministic scheduling for simulation consequences.

## Scheduling

A ScheduledDecisionEffect contains:
- a stable unique ID;
- a due simulation date;
- one or more DecisionEffects;
- a sequence number for deterministic ordering.

scheduleDecisionEffect calculates the due date from the current GameState date plus a non-negative integer delay.

## Processing

processDueDecisionEffects:
1. orders queued items by due date and then sequence;
2. applies every item due on or before the current simulation date;
3. returns the updated GameState;
4. returns applied and still-pending queue entries separately.

The input queue and GameState are not mutated.

## Boundaries

This is simulation scheduling, not a claim that a historical event caused a later real-world outcome. Content authors remain responsible for sourced historical claims.

Durable persistence of the pending queue belongs to milestone 35 Save/Load.
