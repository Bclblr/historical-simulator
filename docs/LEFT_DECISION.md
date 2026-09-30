# Left Decision

Milestone 26 binds a LEFT swipe to an explicit DecisionOption.

## Important rule

LEFT does not globally mean reject, oppose, deny or any other fixed action. Historical situations differ. The authored DecisionOption supplies the label and description.

Examples of neutral action semantics can include:
- defer;
- request more information;
- decline a proposal;
- choose an alternative administrative response.

These are content semantics, not properties of the gesture.

## DecisionOption

A DecisionOption contains:
- stable option ID;
- source event ID;
- player-facing label;
- optional explanatory description;
- optional swipe direction.

Only one option may be bound to LEFT for a given option set. getLeftDecision returns that option or null.

## Deliberate exclusions

This milestone does not apply effects, change flags, advance time or create counterfactual outcomes. It only resolves the player's explicit option selection.
