# Save / Load

Milestone 35 makes the complete core simulation session durable in SQLite.

A saved session contains:
- GameState, including date, selection, flags and variables;
- DecisionRecord history;
- pending ScheduledDecisionEffect entries.

Schema version 2 adds decision_history_json and scheduled_effects_json to game_sessions through a forward migration. Migration 001 remains immutable.

The repository validates JSON payload shapes while loading. A malformed runtime payload fails loudly instead of silently producing a corrupted simulation.

GameSessionService starts, resumes and saves a GameSessionSnapshot so the core engine can restore the information required by conditional events and delayed consequences.

This persistence stores player simulation state only. It does not change historical-source classifications or turn counterfactual outcomes into historical facts.
