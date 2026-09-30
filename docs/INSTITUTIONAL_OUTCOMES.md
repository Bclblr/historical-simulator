# Institutional Outcomes

Milestone 54 adds a generic simulation outcome model for institutional systems.

An InstitutionalOutcome records an institution, outcome kind, authored subject, numeric value, optional note and an optional source InstitutionAction.

Supported kinds are INFLUENCE_CHANGE, RELATIONSHIP_CHANGE, CONFLICT_CHANGE, FLAG and OTHER.

The outcome model records intended simulation effects; it does not by itself rewrite historical evidence. A source action can be linked when the outcome follows a request or directive.

Numeric values are deliberately generic at this layer. The consuming system is responsible for applying its own bounds and semantics.

Historical claims about real institutional consequences must remain in the sourced history layer. Counterfactual outcomes produced by player decisions must remain identifiable as simulation content.
