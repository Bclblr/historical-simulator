# Document Inspection

Milestone 40 adds a read-only inspection layer for historical documents.

## Inspection state

UNOPENED -> OPENED -> REVIEWED

Progress is represented from 0 to 1. Reaching 1 marks the document reviewed.

## Inspection view

createDocumentInspectionView exposes the published document's:
- title and date;
- document type and language;
- summary;
- transcription;
- historical classification;
- derived content layer.

The view does not rewrite, merge or infer missing document content. Draft and archived records are not exposed through this player-facing inspection function.

Historical classification remains visible so primary material, interpretation, adaptation and counterfactual simulation are not silently conflated.

Source/citation presentation is expanded later in milestones 56-60.
