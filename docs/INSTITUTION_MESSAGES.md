# Institution Messages

Milestone 42 defines the general inter-institution communication layer.

InstitutionMessage is distinct from Telegram. Telegram models the delivery state of a historical TELEGRAM document; InstitutionMessage models broader simulation correspondence between institutions.

## Message kinds

NOTICE, REQUEST, REPORT, DIRECTIVE, REPLY and OTHER are structural categories. Their existence does not imply that a particular historical institution used a specific message unless content data and sources establish it.

## Lifecycle

SENT -> DELIVERED -> READ

Messages cannot be read before delivery, and delivery cannot precede the sent date.

Messages may optionally reference a historical event or document. This keeps source-bearing historical material separate from simulation communication state.

Later institutional authority and order/request milestones can build rules on top of this transport model rather than embedding authority assumptions here.
