# Institution Model

Institution is a historical organizational entity within a Country.

## Scope

The model is intentionally generic. It can represent executive, legislative, judicial, military, security, diplomatic, administrative, political or economic institutions without embedding any era-specific ideology, authority or behavior into the engine.

## Responsibilities

An Institution defines:

- a stable machine-readable ID;
- its parent Country;
- an optional parent Institution for organizational hierarchies;
- full and short display names;
- an editorial description;
- a broad organizational type;
- deterministic sort order;
- lifecycle status.

## Invariants

- id, countryId and name cannot be empty.
- An Institution cannot be its own parent.
- Parent relationships express structure only; authority rules belong to later simulation systems.
- sortOrder is an integer.
- Historical display names never act as IDs.
- InstitutionType is descriptive metadata, not a gameplay power ranking.

## Persistence boundary

InstitutionRepository is the domain-facing persistence contract. It supports stable-ID lookup and filtered listing within a Country.

The version-1 database migration remains immutable. Parent relationships and richer metadata will be introduced through a forward migration when persistence is expanded.
