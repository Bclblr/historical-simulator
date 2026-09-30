# Bureaucratic Influence

Milestone 48 adds a subject-specific bureaucratic influence variable.

BureaucraticInfluence connects an institution to an authored subject and stores a bounded simulation value from 0 to 100.

This value represents how much procedural or institutional weight the simulation assigns to that institution for that subject. It is intentionally separate from:
- institutional authority, which describes permitted actions;
- institution relationships, which describe directional relationships between institutions;
- historical evidence, which remains in the history/source domain.

A high influence value does not automatically mean legal authority, political legitimacy, historical importance or moral value. It is only a gameplay variable.

The engine does not infer influence from institution names or historical reputation. Concrete historical content must author and source claims separately. Later hierarchy, conflict and consequence systems can consume this value.
