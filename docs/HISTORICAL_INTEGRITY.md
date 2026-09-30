# Historical Fact / Simulation Boundary

Historical Simulator keeps historical record, scholarly interpretation, dramatized presentation and counterfactual simulation as separate content layers.

## Layers

### HISTORY
HISTORICAL_FACT and PRIMARY_SOURCE represent the historical record/evidence layer.

PRIMARY_SOURCE means the item is itself primary-source material. It does not mean every claim inside that source is automatically factual or unbiased.

### INTERPRETATION
HISTORIOGRAPHICAL_INTERPRETATION represents a scholarly interpretation. It must not be silently rendered as an uncontested historical fact.

### ADAPTATION
DRAMATIZED_ADAPTATION represents reconstructed or authored presentation material. It must be visibly distinguishable from verbatim historical evidence.

### SIMULATION
COUNTERFACTUAL_SIMULATION represents content created by or for an alternate-history branch. It must never be cited or displayed as evidence of what historically happened.

## Domain enforcement

content-integrity.ts is the shared policy boundary. It maps classifications to layers and exposes guards for contexts that require historical evidence or simulation content.

This is intentionally separate from UI labels. Future screens and the game engine should consume these rules rather than reimplementing classification logic.

## Source confidence

SourceConfidence and content classification answer different questions.

- Source confidence describes the evidentiary/provenance strength assigned by the editorial workflow.
- Content classification describes what kind of content an entity is.

A confidence value never converts simulation material into historical evidence.

## Editorial rule

Whenever the product compares the real timeline with a player-created timeline, each item retains its original classification. A simulated branch may reference historical context, but its invented outcome remains COUNTERFACTUAL_SIMULATION.

## Primary-source caution

Primary sources can contain propaganda, errors, bias or incomplete information. The PRIMARY_SOURCE label identifies provenance, not truthfulness or endorsement.
