# Perspective System

Milestone 45 combines the active era, country, institution and role into a GamePerspective.

A perspective determines the simulation viewpoint used to evaluate information access and institution-specific reliability assessments.

## Information

inspectInformationFromPerspective first applies the subject's InformationAccessRule. If the current institution cannot access the subject, no reliability assessment is exposed. If it can, the assessment for that institution is returned when available.

Missing access rules remain accessible by default, matching the milestone 44 policy.

## Switching

switchPerspective allows country, institution and role to change while keeping the era fixed inside the same simulation session. Cross-era movement requires a separate session/context rather than silently mutating historical time.

Changing perspective does not alter HistoricalDocument, HistoricalEvent, citations or historical classifications. It changes only which simulation information is visible and which institution-specific assessment is presented.

This is the foundation for the later perspective-switching gameplay milestone; it does not yet define UI navigation or institutional authority rules.
