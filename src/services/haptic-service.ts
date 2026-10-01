export type HapticCue = 'SELECTION' | 'DECISION' | 'DOCUMENT';

export interface HapticPreferences {
  enabled: boolean;
}

let preferences: HapticPreferences = { enabled: true };

export function getHapticPreferences(): HapticPreferences {
  return { ...preferences };
}

export function setHapticPreferences(
  next: Partial<HapticPreferences>,
): HapticPreferences {
  preferences = {
    enabled: next.enabled ?? preferences.enabled,
  };
  return getHapticPreferences();
}

export async function triggerHapticCue(_cue: HapticCue): Promise<void> {
  if (!preferences.enabled) return;
}
