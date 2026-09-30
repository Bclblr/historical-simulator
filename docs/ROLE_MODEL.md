# Historical Role Model

HistoricalRole represents an office, post or functional position inside an Institution. It is deliberately separate from HistoricalPerson.

A role may exist even when no named person is attached to it, and the same role may be occupied by different people over time.

## Responsibilities

A HistoricalRole defines:

- a stable machine-readable ID;
- its parent Institution;
- an optional parent Role for organizational hierarchy;
- full and short display names;
- an editorial description;
- a broad role type;
- deterministic sort order;
- lifecycle status.

## Invariants

- id, institutionId and name cannot be empty.
- A Role cannot be its own parent.
- Role hierarchy describes organizational structure only.
- A Role does not contain a historical person's biography or identity.
- Authority, influence and decision permissions belong to later simulation systems.
- sortOrder is an integer.
- Display names never act as IDs.

## Persistence boundary

HistoricalRoleRepository is the domain-facing persistence contract. It supports stable-ID lookup and filtered listing within an Institution.

The version-1 database migration remains immutable. Richer role metadata and hierarchy persistence will be introduced through a forward migration.
