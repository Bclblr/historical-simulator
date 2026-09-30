# Information Reliability

Milestone 43 adds perspective-bound information reliability to the simulation.

InformationAssessment records how one institution currently assesses a piece of information identified by subjectId.

Reliability values are UNKNOWN, LOW, MEDIUM and HIGH.

## Critical separation

InformationReliability is not a historical truth score and must not be derived automatically from HistoricalContentClassification.

For example, a primary source is evidence of what a source recorded or communicated; its PRIMARY_SOURCE classification does not automatically make every claim inside it true. Likewise, a simulation institution may assess information as HIGH reliability while later evidence shows it was mistaken.

Historical provenance and classification remain in the history domain. InformationAssessment belongs to the simulation perspective.

The rationale field is authored context explaining why the in-game perspective assigns the assessment. Later visibility and perspective systems can use these assessments without rewriting historical records.
