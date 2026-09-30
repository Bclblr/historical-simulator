# Desk File System

Milestone 37 defines the dossier/file unit used on the desk.

A DeskFile groups one or more historical documents around an event or administrative matter. It stores stable document IDs rather than copying document content.

## Status

- INBOX: newly received on the desk.
- OPEN: currently being handled.
- REVIEWED: reviewed but retained for reference.
- ARCHIVED: removed from the active desk flow.

## Selection

selectNextDeskFile considers INBOX and OPEN files and selects the highest authored integer priority. Priority is a simulation/UI ordering value, not a historical importance rating.

## Documents

getDeskFileDocuments resolves a file's document IDs against HistoricalDocument records. Telegram and newspaper presentation remain separate milestones even though HistoricalDocument already supports those source types.

Desk files organize simulation material. They do not alter a document's historical classification or source status.
