# Technical Architecture

Status: **2/100 — Architecture baseline**

## Goals

- Offline-first single-player architecture.
- Historical content stays independent from UI and engine code.
- New eras, countries, institutions and roles must not require rewriting the engine.
- Documented history and counterfactual simulation remain distinct in data.
- No mandatory backend for the first prototype.

## Technology baseline

- React Native + Expo + TypeScript
- Expo Router for navigation
- expo-sqlite for persistent local relational data
- React Native Gesture Handler for gestures
- React Native Reanimated for animation
- No Supabase/backend in the initial prototype

Package versions are intentionally not hard-coded here; implementation uses Expo-compatible versions at setup time.

## Layered design

```text
Presentation / Routes
        ↓
Application / Use Cases
        ↓
Game Engine / Domain
        ↓
Repository Interfaces
        ↓
SQLite + Bundled Content
```

### Presentation
Screens, reusable UI, animations and gestures. No historical branching rules or SQL.

### Application
Coordinates use cases such as starting a session, opening an event, making a decision, saving and reading archive entries.

### Domain / Game Engine
Pure TypeScript whenever possible. Owns GameState, event eligibility, conditions, effects, flags, delayed consequences and timeline progression. It does not import React components, Expo Router or SQLite.

### Data
Repositories translate stored records into domain objects. SQLite can later be supplemented by cloud/content repositories without changing the engine.

## Content hierarchy

```text
Era
└── Country
    └── Institution
        └── Role
            └── Event
                ├── Documents
                ├── Sources
                ├── Conditions
                ├── Decisions
                └── Effects
```

Historical content is data rather than hard-coded screen logic. Events use stable IDs.

## Historical integrity boundary

The model will explicitly distinguish HISTORICAL_FACT, PRIMARY_SOURCE, HISTORIOGRAPHICAL_INTERPRETATION, DRAMATIZED_ADAPTATION and COUNTERFACTUAL_SIMULATION. A simulated consequence cannot silently overwrite historical-status metadata.

## Persistence

SQLite stores two conceptual groups: content data (eras, countries, institutions, roles, people, events, documents, decisions, sources) and player data (sessions, state, decisions, flags, discoveries, delayed consequences and save metadata). Schema migrations are versioned from the beginning.

## State ownership

Persistent truth lives in SQLite/save data. React state is for current UI state. GameState is serializable so a session can be reconstructed after the app closes. No large global state library is required initially.

## Engine operations

The engine will expose concepts such as createSession, getEligibleEvents, evaluateConditions, applyDecision, scheduleConsequence, advanceDate, resolveDueConsequences, saveSession and restoreSession. Randomness, if used, is seedable/injectable for reproducible tests.

## Routing boundary

Expo Router owns navigation only. Planned areas include home; setup (period/country/institution/role); game (desk/event/document/map); archive (timeline/sources); and settings. Routes call application services rather than implementing game rules.

## Offline-first

Core gameplay works without internet. The first scenario ships locally. A future online layer may add optional accounts, cloud saves, downloadable scenario packs, content corrections and opt-in aggregate statistics.

## Integrity rules

- Decision writes that belong together use transactions.
- Stable IDs are not derived from translated display names.
- Save/schema versions are recorded.
- Missing content fails visibly rather than inventing historical information.
- Unverified source metadata is never presented as verified.
- Later validators check broken event links, missing sources and impossible conditions.

## Proposed source tree

```text
src/
  app/
  components/
  features/
  domain/
    game/
    history/
  data/
    db/
    repositories/
    content/
  services/
  theme/
  utils/
  types/
assets/
  images/
  documents/
  audio/
docs/
```

Exact folders are created/refined in milestone 5.

## Dependency rules

1. Domain cannot import UI, Expo Router or SQLite.
2. UI cannot contain SQL.
3. Historical content cannot be scattered through components.
4. Data may depend on domain contracts; domain cannot depend on data implementations.
5. Cross-era features use generic contracts rather than country-specific checks.
6. Counterfactual results retain their simulation classification.

## Architecture decision

**Expo app → application services → pure TypeScript game engine → repository interfaces → expo-sqlite**

This is the project baseline until replaced by a documented architecture decision.