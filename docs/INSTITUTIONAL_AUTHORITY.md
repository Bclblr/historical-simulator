# Institutional Authority

Milestone 46 adds explicit institutional authority grants to the simulation.

An authority grant connects:
- an institution;
- a role;
- an action;
- an authored subject/scope.

Supported structural actions are VIEW, ADVISE, REQUEST, APPROVE, DIRECT and OTHER.

The engine does not infer authority from a role title, institution name, political importance or historical reputation. A role has an authority only when content data explicitly grants it.

hasInstitutionalAuthority evaluates a grant against the current GamePerspective. getPerspectiveAuthority returns the grants available to that institution-role pair.

These grants are simulation/content rules, not claims that a real historical office possessed a power. Historical content packs must source concrete authority assignments where they are presented as historical facts. Later hierarchy, position and order/request milestones build on this foundation.
