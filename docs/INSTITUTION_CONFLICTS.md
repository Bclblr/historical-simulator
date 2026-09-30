# Institution Conflicts

Milestone 52 adds explicit simulation conflicts between two institutions.

A conflict stores the two participating institution IDs, an authored subject, LOW/MEDIUM/HIGH intensity, ACTIVE/RESOLVED status and an optional note.

Conflict is kept separate from InstitutionRelationship and BureaucraticInfluence. A competitive relationship does not automatically create a conflict, and an influence value does not determine conflict intensity.

The model does not infer historical disputes from institution names, political reputation or other game variables. Historical conflicts must be authored and sourced separately when presented as historical facts.

Intensity is a gameplay state, not a moral rating or claim about historical importance. Later order/request and institutional consequence systems can react to conflict state without changing the historical evidence layer.
