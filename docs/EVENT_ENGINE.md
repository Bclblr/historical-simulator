# Event Engine

The Event Engine is a pure TypeScript domain service that determines which historical events are currently eligible for a game session.

## Current eligibility rules

An event is eligible when:
- it is PUBLISHED;
- it belongs to the selected Era;
- its country scope is empty/global or includes the selected country;
- its institution scope is empty/global or includes the selected institution;
- the current game date is on or after its start date;
- the current game date has not passed its optional end date.

Eligible events are ordered by start date and then sortOrder.

## Deliberate exclusions

Milestone 23 does not:
- apply player decisions;
- mutate GameState;
- evaluate flags or variables;
- schedule consequences;
- infer causal history;
- convert historical material into counterfactual content.

Those behaviors belong to later roadmap milestones.

## Architecture

The engine imports domain models only. It has no React, Expo Router, SQLite or UI dependency. This keeps historical eligibility deterministic and testable.

## Historical integrity

Event classification is preserved exactly as authored. Eligibility does not change HISTORICAL_FACT, PRIMARY_SOURCE, interpretation, adaptation or simulation classifications.
