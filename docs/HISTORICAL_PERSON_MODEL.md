# Historical Person Model

HistoricalPerson represents a real historical individual as content data. A person is not the same thing as a Role.

## Responsibilities

A HistoricalPerson defines a stable ID, display names, an editorial biographical summary, optional life dates, deterministic sort order and lifecycle status.

HistoricalRoleTenure links a person to a HistoricalRole for a bounded period. This supports office changes over time without rewriting the person's identity.

## Invariants

- Person id and name cannot be empty.
- Optional life dates use YYYY-MM-DD.
- Birth cannot be after death.
- A tenure requires personId, roleId and a valid start date.
- A tenure end cannot precede its start.
- Role tenure expresses a historical relationship; it does not grant simulation permissions by itself.
- Biography content remains editorial historical content and will be source-backed by the citation system introduced in later milestones.

## Persistence boundary

HistoricalPersonRepository and HistoricalRoleTenureRepository are domain-facing contracts. New tables/columns must be introduced through forward migrations; migration 001 remains immutable.
