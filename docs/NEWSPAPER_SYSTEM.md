# Newspaper System

Milestone 39 adds newspaper issues to the simulation layer.

HistoricalDocument remains the source-bearing record. NewspaperIssue must reference a HistoricalDocument with type NEWSPAPER.

## Lifecycle

UNAVAILABLE -> AVAILABLE -> READ

An issue becomes available when the simulation date reaches its availableFrom date. It cannot be marked read before then.

## Dates

issueDate represents the issue's publication date. availableFrom controls when the player's current perspective can access it. Keeping these separate allows later perspective and information-delay systems without rewriting the historical document.

getAvailableNewspapers returns currently available unread issues, newest issue first.

Publication metadata and availability are simulation/presentation data. Historical claims and authenticity remain governed by the referenced document, citations and classification.
