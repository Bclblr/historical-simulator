# Historical Date Engine

The simulation date layer no longer depends on JavaScript Date for historical chronology.

## Representation

HistoricalDate uses:
- era: BCE or CE;
- positive year number;
- month;
- day.

There is no historical year zero. Internally, comparisons and arithmetic temporarily use astronomical year numbering so BCE/CE transitions can be calculated consistently.

Canonical serialization:
- CE:1933-01-30
- BCE:0044-03-15

Existing save files using YYYY-MM-DD remain readable and are interpreted as CE. New writes can use the canonical prefixed form.

## Operations

The domain provides:
- validation;
- parse/serialize;
- chronological comparison;
- integer day advancement and rewind;
- BCE/CE boundary handling.

## Calendar convention

The first implementation uses a proleptic Gregorian-style month/leap-year calculation for deterministic simulation arithmetic. It does not claim that historical societies themselves used that calendar.

Future content may add display-calendar metadata where historically appropriate while keeping one deterministic internal chronology.

## Persistence compatibility

The existing current_date TEXT column can store both legacy CE dates and canonical BCE/CE strings, so milestone 22 does not require a destructive database migration.
