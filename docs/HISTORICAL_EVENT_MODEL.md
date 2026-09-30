# Historical Event Model

HistoricalEvent represents a dated historical occurrence or bounded historical process.

It is historical content, not a player decision and not a simulated consequence. Decision branches and event-to-event relationships are modeled in later milestones.

## Responsibilities

An event defines a stable ID, parent Era, related countries/institutions/people, title and summary, date range, geographic/political scope, content classification, deterministic ordering and lifecycle status.

## Invariants

- id, eraId and title cannot be empty.
- Dates use YYYY-MM-DD.
- An optional end date cannot precede the start date.
- Related entity ID arrays are normalized and deduplicated.
- Event classification is explicit.
- Event data does not contain player choices or gameplay effects.
- Historical claims will be linked to sources by the citation system in milestone 18.

## Classification

The existing HistoricalContentClassification vocabulary is reused so historical fact, primary-source material, interpretation, dramatized adaptation and counterfactual simulation can never become implicit UI assumptions.

Milestone 20 will enforce the final cross-model historical-fact/simulation boundary.

## Persistence

HistoricalEventRepository is the domain-facing persistence contract. New event persistence structures must be introduced through forward migrations; migration 001 remains immutable.
