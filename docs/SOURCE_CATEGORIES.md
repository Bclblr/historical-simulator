# Primary and Secondary Sources

Milestone 57 adds an explicit source-category layer.

ARCHIVAL_RECORD and PRIMARY_PUBLISHED are classified as PRIMARY.

MONOGRAPH, EDITED_VOLUME, BOOK_CHAPTER, JOURNAL_ARTICLE, THESIS, REFERENCE_WORK and MUSEUM_OR_INSTITUTION are classified as SECONDARY.

OTHER remains UNCLASSIFIED. The application must not guess whether an ambiguous source is primary or secondary.

The category is also exposed through SourceDisplay so presentation layers can label citations consistently.

Source category is about the source's relationship to historical evidence. It is separate from confidence grade, verification status and historical-content classification. A primary source is not automatically accurate, complete or unbiased, and a secondary source is not automatically less reliable.
