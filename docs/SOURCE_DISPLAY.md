# Source Display

Milestone 56 introduces a presentation-ready source display model for historical content.

SourceDisplay joins an existing HistoricalCitation to its HistoricalSource and exposes the fields needed by application and UI layers without duplicating historical evidence.

It includes the source title, authors or editors, publication year, source type, confidence grade, citation locator and note, plus URL and DOI when available.

getSourceDisplaysForTarget returns the citations attached to a historical entity as display records.

This layer does not decide whether a source is primary or secondary, build a bibliography, interpret page numbers, validate archive references or verify scholarly claims. Those responsibilities remain separate roadmap milestones.

A missing source is treated as an integrity error rather than silently producing an incomplete citation.
