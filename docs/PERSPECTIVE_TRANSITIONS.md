# Perspective Transitions

Milestone 55 adds an explicit transition record around the existing perspective system.

A PerspectiveTransition stores the previous and next GamePerspective plus an authored reason. Creation reuses switchPerspective, so a transition cannot move to another era within the same simulation session.

Callers may provide a list of institution IDs currently available for switching. The transition rejects a target outside that list.

A transition must actually change country, institution or role. The resulting perspective can then be applied by the session/application layer.

This model records simulation viewpoint changes only. It does not alter historical facts, historical person records, institutional authority or source evidence.

Persistence and user-facing perspective selection remain separate concerns for later save/UI integration.
