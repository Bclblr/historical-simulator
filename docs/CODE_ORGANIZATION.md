# Code Organization Standard

## Dependency direction

```text
Routes / UI
    ↓
Features / Application Services
    ↓
Domain contracts and game engine
    ↑
Repository implementations / SQLite
```

The domain defines the rules and contracts it needs. Infrastructure fulfills those contracts.

## Ownership

### src/app
Expo Router route entry points. Keep route files thin.

### src/components
Reusable presentation components without game rules or SQL.

### src/features
Feature-specific UI/application coordination.

### src/domain/game
GameState, decisions, conditions, effects, event eligibility, timeline and other simulation rules.

### src/domain/history
Historical entity types, classifications and history-specific invariants.

### src/data/db
SQLite initialization, migrations and low-level persistence helpers.

### src/data/repositories
Persistence implementations/contracts that translate between stored data and domain objects.

### src/data/content
Bundled historical scenario/content import and seed material.

### src/services
Application use cases that coordinate domain logic and repositories.

### src/theme
Design tokens and visual-system definitions.

### src/utils
Generic helpers only.

### src/types
Cross-cutting infrastructure types only.

## Non-negotiable rules

1. No SQL in route or component files.
2. No React/Expo imports in the domain layer.
3. No historical event text scattered through UI components.
4. No Germany-specific conditions in the generic game engine.
5. UI state is not persistent game truth.
6. Counterfactual data must retain an explicit simulation classification.
7. New modules expose deliberate public APIs through index files where useful.
8. Circular dependencies are not accepted.

## Import aliases

`@/*` resolves to `src/*` through TypeScript configuration.

## Naming

- React components: PascalCase.
- Domain/service files: kebab-case.
- Types/interfaces: PascalCase.
- Functions/variables: camelCase.
- Stable content IDs: lowercase machine-readable identifiers; display names never act as IDs.

## Milestone 5 acceptance gate

- Core directory boundaries exist.
- Domain has no React/SQLite dependency.
- A repository contract exists.
- An application service consumes that contract.
- GameState has an initial generic representation.
- Architecture rules are documented.
