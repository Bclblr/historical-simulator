# Swipe System

Milestone 25 defines the presentation-independent swipe intent model.

## Responsibilities

The domain resolves a horizontal gesture into:
- no committed swipe;
- LEFT;
- RIGHT.

A swipe can commit by distance or horizontal velocity. swipeProgress returns a normalized -1..1 value for future UI animation.

## Separation from decisions

LEFT and RIGHT have no historical or gameplay meaning at this milestone. The swipe layer must not decide whether a gesture means approve, reject, delay, investigate or any other action.

Milestones 26 and 27 bind left/right directions to explicit decision options. Milestone 28 generalizes cards beyond two choices.

## UI boundary

This module has no React Native Gesture Handler or animation dependency. A future UI gesture component can feed translationX and velocityX into resolveSwipe, keeping gesture recognition testable outside the UI.

## Defaults

Default thresholds are domain interaction defaults, not historical content. UI tuning may later override them through SwipeConfig.
