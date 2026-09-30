# Telegram System

Milestone 38 adds the simulation delivery layer for telegram documents.

HistoricalDocument remains the source-bearing historical record. A Telegram references a HistoricalDocument whose type must be TELEGRAM and adds only game-state delivery metadata.

## Lifecycle

QUEUED -> DELIVERED -> READ

A queued telegram cannot be marked read. Delivery records a validated simulation date.

## Routing

Each telegram stores sender and recipient institution IDs. getUnreadTelegrams returns delivered, unread telegrams for one institution.

Sender/recipient metadata and delivery state do not establish historical authenticity. Historical claims, transcription and classification remain on the referenced HistoricalDocument and its citations.
