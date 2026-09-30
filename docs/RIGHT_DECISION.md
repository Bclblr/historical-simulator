# Right Decision

Milestone 27 exposes the explicit RIGHT decision binding.

RIGHT, like LEFT, has no universal gameplay meaning. The authored DecisionOption defines the action. This avoids encoding political, moral or administrative meaning into a gesture direction.

## Resolution

getRightDecision delegates to the same getSwipeDecision invariant used by LEFT:
- zero RIGHT-bound options returns null;
- one returns that DecisionOption;
- multiple RIGHT-bound options are rejected as ambiguous.

## Separation of concerns

Selecting an option still does not mutate GameState, apply effects, set flags or create outcomes. Those behaviors are introduced in later milestones.
