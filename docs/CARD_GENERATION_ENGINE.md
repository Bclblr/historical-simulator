# Card Generation Engine

The Card Generation Engine transforms an eligible HistoricalEvent into a presentation-neutral GameCard.

## Why a separate card model?

HistoricalEvent is source/content data. GameCard is the runtime presentation payload. Keeping them separate prevents UI requirements from contaminating the historical record and allows future desk, telegram, newspaper and other presentation systems to reuse the same event.

## GameCard fields

A generated card retains:
- a deterministic card ID;
- source event ID;
- title and body;
- event date and scope;
- historical content classification;
- related country, institution and person IDs.

Arrays are copied so presentation code cannot accidentally mutate the HistoricalEvent record.

## Eligibility

generateEligibleCards and generateNextCard delegate eligibility to Event Engine. Card generation does not independently reinterpret chronology or perspective rules.

## Deliberate exclusions

Milestone 24 does not generate decisions, left/right actions, gameplay effects or counterfactual outcomes. Those are introduced in milestones 26–29.

Card generation also never changes the historical classification inherited from the source event.
