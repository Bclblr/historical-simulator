# Bibliography

Milestone 58 adds a bibliography model derived from HistoricalSource records.

A BibliographyEntry contains the source identifier, source category, contributors, title, publication year, publisher or journal/collection metadata, volume, issue, DOI and URL.

createBibliography de-duplicates sources by source ID and returns a stable academic-style ordering: first contributor, publication year, then title.

The bibliography layer preserves structured metadata rather than generating a hard-coded citation style. Final formatting such as Chicago, APA or another style belongs to the presentation layer.

Citation locators and page numbers are not bibliography metadata and remain part of individual citations. Page-specific support is handled separately in milestone 59. Archive-specific presentation is handled in milestone 60.
