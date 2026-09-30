# Information Visibility

Milestone 44 adds perspective-bound access rules for simulation information.

Visibility levels:
- PUBLIC: accessible to every institution perspective.
- INSTITUTION: accessible to the explicitly listed institution or institutions.
- RESTRICTED: accessible only to explicitly listed institutions and semantically marked as restricted for later UI treatment.
- HIDDEN: unavailable through ordinary institution access.

INSTITUTION and RESTRICTED rules require at least one institution ID.

If no access rule exists for a subject, filterAccessibleInformation treats it as accessible. Content authors must therefore add explicit rules for material intended to be concealed.

## Historical integrity

Visibility is a simulation access rule. It does not remove, rewrite or downgrade the underlying historical record, citation or classification. A document can be historically known to the modern player while remaining unavailable to the in-game institution at that simulated date.

This model is intentionally about legitimate game-state visibility, not methods for concealing real-world activity.
