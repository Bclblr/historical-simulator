# Institution Actions

Milestone 53 adds a generic request/directive workflow between institutions.

InstitutionAction records sender institution and role, recipient institution, kind, subject, issue date, status and an optional note.

Kinds are REQUEST and DIRECTIVE. Creation checks the existing institutional authority grants: REQUEST requires REQUEST authority and DIRECTIVE requires DIRECT authority for the authored subject.

Statuses are ISSUED, ACKNOWLEDGED, COMPLETED, DECLINED and CANCELLED. These states describe workflow only; they do not imply that an instruction was historically issued or carried out.

The system is separate from inter-institution messages: a message represents communication, while an InstitutionAction represents a structured institutional request or directive.

Historical examples must be authored and sourced separately. The engine does not infer legal power, hierarchy or historical legitimacy from an action.
