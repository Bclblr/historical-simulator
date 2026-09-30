# Era Model

The Era entity is the top-level historical content boundary.

## Responsibilities

An Era defines:

- a stable machine-readable ID;
- full and short display names;
- an editorial description;
- exact inclusive ISO date boundaries;
- derived start/end years for simple display and filtering;
- deterministic sort order;
- lifecycle status: DRAFT, PUBLISHED or ARCHIVED.

## Invariants

- IDs and names cannot be empty.
- Dates use YYYY-MM-DD.
- The start date cannot be after the end date.
- sortOrder is an integer.
- Years are derived from the date boundaries rather than independently authored.
- An Era contains no country-, regime- or scenario-specific game rules.

## Persistence boundary

The domain contract is EraRepository. SQLite is an infrastructure concern and will implement that contract. Historical content should depend on stable Era IDs, never display names.

The existing version-1 database remains untouched in this milestone. Richer Era persistence fields must be introduced through a forward migration rather than rewriting an already-released migration.
