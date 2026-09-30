# Academic Source and Citation Model

HistoricalSource describes a reusable bibliographic or archival source. HistoricalCitation connects that source to a specific historical entity and locator.

This prevents the same book, article or archive collection from being duplicated for every event.

## Source types

The model supports archival records, published primary sources, monographs, edited volumes, book chapters, journal articles, theses, reference works and museum/institutional resources.

## Confidence

- A: primary evidence plus strong scholarly support.
- B: strong academic consensus or well-supported scholarship.
- C: meaningful historiographical disagreement or limited evidence.
- D: simulation-only/counterfactual material; it must never be presented as historical evidence.

Confidence is provenance metadata, not a score of a historian or political viewpoint.

## Citation locators

Citation.locator is deliberately flexible so later content can use page numbers, chapter/section references, folio numbers, archival file identifiers or comparable precise locators.

## Invariants

- Source id and title are required.
- Citation id, sourceId and targetId are required.
- Source metadata is stored once and reused.
- Citation notes should explain relevance, not silently turn interpretation into fact.
- URLs are metadata; bundled copyrighted source text is not implied by a URL.
- Source verification workflow is represented by DRAFT / VERIFIED / ARCHIVED.
- Detailed verification policy and UI are completed in milestones 56–65.

## Separation of concerns

HistoricalDocument is the historical artifact represented inside the experience. HistoricalSource is the bibliographic/provenance record used to support claims. A primary-source Document may cite the archival or published Source from which its metadata/transcription derives.
