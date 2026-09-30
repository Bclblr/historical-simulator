# ADR-0001 — Offline-first modular architecture

**Status:** Accepted  
**Milestone:** 2/100

## Decision

Historical Simulator uses React Native + Expo + TypeScript with a pure TypeScript domain/game-engine layer and SQLite-backed local persistence. Expo Router handles navigation; Gesture Handler and Reanimated handle interactive motion. The first prototype has no mandatory backend or account.

## Rationale

The product begins as a single-player simulation whose content and saves can operate locally. Separating the engine from React Native and SQLite makes branching logic testable and prevents the first 1933 scenario from defining the architecture of every later country and era.

## Positive consequences

- Offline play
- Fast local event loading
- Testable game rules
- Easier expansion to new states and eras
- Future backend remains optional
- Historical content can be validated independently of UI

## Trade-offs

- Content migrations require discipline.
- Cloud sync needs a later synchronization layer.
- Large future content packs may require downloadable storage.

## Revisit when

Reconsider if cloud-only features become core, bundled content becomes impractical, or multiplayer/live shared state becomes a product requirement.