# Archive References

Milestone 60 adds a structured archive-reference model for archival historical sources.

An ArchiveReference records the archive name and may additionally record collection/fonds, series, box or file, and item/document identifiers. Only the archive name is universally required because archival description systems differ between institutions.

formatArchiveReference provides a neutral comma-separated display form without pretending that every archive follows the same cataloguing convention.

HistoricalSource keeps the existing archiveName and archiveReference fields for backwards compatibility and may additionally carry structuredArchiveReference. SourceDisplay exposes the structured reference to application and UI layers.

This model stores provenance; it does not itself prove authenticity or accuracy. Source verification remains milestone 65.
