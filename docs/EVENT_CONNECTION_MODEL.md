# Event Connection Model

EventConnection describes an explicit relationship between two HistoricalEvent records.

It is historical metadata, not a game-engine trigger. Eligibility conditions, flags and branching behavior belong to the later simulation engine.

## Connection types

- PRECEDES / FOLLOWS: chronological or editorial sequence.
- CONTEXT / RELATED: contextual association without asserting causation.
- ESCALATES: a documented intensification relationship.
- RESPONDS_TO: a documented response relationship.
- CONTRIBUTES_TO: one factor among potentially multiple causes.
- DISPUTED_CAUSAL_LINK: a causal interpretation exists but is historiographically contested.

The model intentionally has no generic CAUSES type. Strong causal claims should not become an unqualified structural fact merely because two events are linked.

## Evidence

citationIds can attach one or more HistoricalCitation records to the relationship itself. This allows the evidence for a relationship to differ from the evidence for either event individually.

## Invariants

- id, sourceEventId and targetEventId are required.
- An event cannot connect to itself.
- Citation IDs are normalized and deduplicated.
- Connection direction is explicit.
- Connection metadata never acts as a gameplay condition by itself.

## Persistence

EventConnectionRepository provides incoming/outgoing lookup and persistence contracts. Database support must be added with a forward migration; migration 001 remains immutable.
