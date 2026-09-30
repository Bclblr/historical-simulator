# Conditional Events

Milestone 33 lets authored event rules depend on simulation state without teaching the engine historical causality.

## Supported conditions

- FLAG: a named boolean must match an expected value.
- VARIABLE: a numeric GameState variable is compared with EQ, NE, GT, GTE, LT or LTE.
- DECISION: a specific option must previously have been selected for a specific event.

All conditions in an event rule are ANDed by matchesAllEventConditions.

## Integration

Event Engine accepts optional conditions and a decision-history context. Existing callers that provide no conditions continue to use publication, era, country, institution and date eligibility only.

A failed authored condition produces CONDITION_NOT_MET.

## Historical integrity

Conditions are simulation rules authored by content designers. Their existence does not establish a historical causal relationship. Claims about real-world causality remain in sourced historical content and event connections.
