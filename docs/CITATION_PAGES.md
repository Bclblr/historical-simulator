# Citation Pages

Milestone 59 adds structured page references to HistoricalCitation.

A citation may point to one positive integer page or to an inclusive start/end page range. Invalid zero, negative, non-integer or reversed ranges are rejected by createCitationPages.

formatCitationPages provides a neutral display form such as p. 42 or pp. 42–45. Citation styles may replace that formatting later without changing stored data.

The existing free-form locator remains available for non-page locators and backwards compatibility. Structured pages are also exposed through SourceDisplay.

Page references belong to individual citations, not bibliography entries. Archive references remain a separate concern for milestone 60.
