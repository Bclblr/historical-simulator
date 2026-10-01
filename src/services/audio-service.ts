export type SoundCue =
  | 'DOCUMENT_OPEN'
  | 'DOCUMENT_CLOSE'
  | 'DECISION_RECORDED'
  | 'MESSAGE_RECEIVED';

export interface AudioPreferences {
  enabled: boolean;
  volume: number;
}

let preferences: AudioPreferences = {
  enabled: true,
  volume: 0.65,
};

export function getAudioPreferences(): AudioPreferences {
  return { ...preferences };
}

export function setAudioPreferences(
  next: Partial<AudioPreferences>,
): AudioPreferences {
  preferences = {
    enabled: next.enabled ?? preferences.enabled,
    volume: Math.max(0, Math.min(1, next.volume ?? preferences.volume)),
  };
  return getAudioPreferences();
}

export async function playSoundCue(_cue: SoundCue): Promise<void> {
  if (!preferences.enabled) return;
}
