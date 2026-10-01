# Historical Outcome — “What Happened Historically?”

Milestone 61 introduces a historical-outcome model for the “What happened historically?” experience.

createHistoricalOutcome accepts a HistoricalEvent and builds a read-only historical view containing its title, summary, dates and event citations.

The event must belong to the HISTORY evidence layer. Counterfactual simulation, dramatized adaptation and historiographical interpretation cannot be passed off as the historical outcome. This enforces the project's separation between recorded history and player-created timelines.

Only citations whose targetType is EVENT and whose targetId matches the event are included. Their source metadata is resolved through the existing SourceDisplay system.

This milestone creates the domain/view-model foundation. Final screen layout belongs to the later UX work. Historians' interpretations are intentionally separate and begin at milestone 62.
