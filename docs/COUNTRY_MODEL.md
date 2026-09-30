# Country Model

Country is the second-level historical content boundary beneath an Era.

The name is a product/domain convention. It can represent a historical state or political entity appropriate to the selected Era; the generic engine must not assume a modern nation-state.

## Responsibilities

A Country defines:

- a stable machine-readable ID;
- the parent Era ID;
- full and short display names;
- an editorial description;
- deterministic sort order;
- lifecycle status: DRAFT, PUBLISHED or ARCHIVED.

## Invariants

- id, eraId and name cannot be empty.
- Display names never act as IDs.
- sortOrder is an integer.
- Country does not contain institution-specific rules.
- Country does not encode modern borders, governments or ideologies as generic engine assumptions.

## Persistence boundary

CountryRepository is the domain-facing persistence contract. It supports lookup by stable ID and listing entities within an Era.

The version-1 database migration remains immutable. Additional persistence metadata must be added through a later forward migration.
