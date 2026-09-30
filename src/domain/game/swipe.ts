export type SwipeDirection = 'LEFT' | 'RIGHT';

export interface SwipeGesture {
  translationX: number;
  velocityX: number;
}

export interface SwipeConfig {
  distanceThreshold: number;
  velocityThreshold: number;
}

export interface SwipeResolution {
  committed: boolean;
  direction: SwipeDirection | null;
  reason: 'DISTANCE' | 'VELOCITY' | 'BELOW_THRESHOLD';
}

export const DEFAULT_SWIPE_CONFIG: SwipeConfig = {
  distanceThreshold: 96,
  velocityThreshold: 650,
};

function assertFinite(value: number, field: string): void {
  if (!Number.isFinite(value)) throw new Error(`${field} must be finite.`);
}

export function resolveSwipe(
  gesture: SwipeGesture,
  config: SwipeConfig = DEFAULT_SWIPE_CONFIG,
): SwipeResolution {
  assertFinite(gesture.translationX, 'Swipe translationX');
  assertFinite(gesture.velocityX, 'Swipe velocityX');
  assertFinite(config.distanceThreshold, 'Swipe distanceThreshold');
  assertFinite(config.velocityThreshold, 'Swipe velocityThreshold');

  if (config.distanceThreshold <= 0 || config.velocityThreshold <= 0) {
    throw new Error('Swipe thresholds must be greater than zero.');
  }

  const distanceCommitted = Math.abs(gesture.translationX) >= config.distanceThreshold;
  const velocityCommitted = Math.abs(gesture.velocityX) >= config.velocityThreshold;

  if (!distanceCommitted && !velocityCommitted) {
    return { committed: false, direction: null, reason: 'BELOW_THRESHOLD' };
  }

  const decisiveValue = distanceCommitted ? gesture.translationX : gesture.velocityX;
  return {
    committed: true,
    direction: decisiveValue < 0 ? 'LEFT' : 'RIGHT',
    reason: distanceCommitted ? 'DISTANCE' : 'VELOCITY',
  };
}

export function swipeProgress(
  translationX: number,
  distanceThreshold = DEFAULT_SWIPE_CONFIG.distanceThreshold,
): number {
  assertFinite(translationX, 'Swipe translationX');
  assertFinite(distanceThreshold, 'Swipe distanceThreshold');
  if (distanceThreshold <= 0) throw new Error('Swipe distanceThreshold must be greater than zero.');

  return Math.max(-1, Math.min(1, translationX / distanceThreshold));
}
