# Historical Document Model

HistoricalDocument represents a reusable historical document or documentary artifact.

A document can be associated with multiple events, countries, institutions and people. It is not embedded inside one event, which allows the same source object to appear in different historical perspectives.

## Supported document categories

Letter, telegram, memorandum, report, law, decree, treaty, speech, newspaper, diary, minutes, photograph, map and other.

## Responsibilities and invariants

- id, eraId and title are required.
- Optional document dates use YYYY-MM-DD.
- Related entity IDs are normalized and deduplicated.
- Original language can be recorded without assuming a single application language.
- transcription stores text represented by the content package; summary stores editorial explanatory text.
- classification is explicit and defaults to PRIMARY_SOURCE.
- A Document does not itself define a bibliographic citation, archive locator, page reference or scholarly interpretation. Those belong to the source/citation model.
- A Document does not contain player decisions or simulation effects.

## Copyright and provenance

Bundled transcriptions, images and scans must only be included when the project has a lawful basis to distribute them. Metadata may point to a source without copying restricted material.

## Persistence

HistoricalDocumentRepository is the domain-facing persistence contract. New document tables and relationships must be introduced through forward migrations; migration 001 remains immutable.
