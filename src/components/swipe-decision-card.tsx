import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { DecisionOption } from '@/domain/game';
import type { HistoricalEvent } from '@/domain/history';
import { useAppTheme } from '@/theme';
import { getGermany1933CardVisual } from '@/content/germany-1933/card-visuals';
import { getCampaignEventImage, getCampaignConversation } from '@/content/germany-campaign';
import { AppText } from './app-text';
import { CharacterPortrait } from './character-portrait';

interface SwipeDecisionCardProps {
  event: HistoricalEvent;
  leftOption: DecisionOption;
  rightOption: DecisionOption;
  actorLabel: string;
  disabled?: boolean;
  onChoose: (option: DecisionOption) => void;
  onPreviewDirection?: (direction: 'LEFT' | 'RIGHT' | null) => void;
}

const COMMIT_DISTANCE = 78;
const PREVIEW_DISTANCE = 18;
const COMMIT_VELOCITY = 650;

export function SwipeDecisionCard({
  event,
  leftOption,
  rightOption,
  actorLabel,
  disabled = false,
  onChoose,
  onPreviewDirection,
}: SwipeDecisionCardProps) {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const cardWidth = Math.min(Math.max(width - 28, 292), 520);
  const cardHeight = Math.min(Math.max(height * 0.67, 500), 680);
  const translateX = useSharedValue(0);
  const previewState = useSharedValue(0);

  const visualEventId = event.id.endsWith(':follow-up')
    ? event.id.slice(0, -':follow-up'.length)
    : event.id;
  const visual = getGermany1933CardVisual(visualEventId);
  const eventImage = getCampaignEventImage(visualEventId);
  const conversation = getCampaignConversation(event.id, actorLabel, event.summary);

  const notifyPreview = (value: number) => {
    onPreviewDirection?.(value < 0 ? 'LEFT' : value > 0 ? 'RIGHT' : null);
  };

  const commitChoice = (direction: number) => {
    onPreviewDirection?.(null);
    onChoose(direction < 0 ? leftOption : rightOption);
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-5, 5])
        .failOffsetY([-24, 24])
        .onUpdate((event) => {
          translateX.value = event.translationX;
          const nextPreview =
            event.translationX < -PREVIEW_DISTANCE
              ? -1
              : event.translationX > PREVIEW_DISTANCE
                ? 1
                : 0;
          if (nextPreview !== previewState.value) {
            previewState.value = nextPreview;
            scheduleOnRN(notifyPreview, nextPreview);
          }
        })
        .onEnd((event) => {
          const shouldCommit =
            Math.abs(event.translationX) >= COMMIT_DISTANCE ||
            Math.abs(event.velocityX) >= COMMIT_VELOCITY;

          if (!shouldCommit) {
            translateX.value = withSpring(0, { damping: 20, stiffness: 240 });
            if (previewState.value !== 0) {
              previewState.value = 0;
              scheduleOnRN(notifyPreview, 0);
            }
            return;
          }

          const direction =
            event.translationX !== 0
              ? event.translationX < 0 ? -1 : 1
              : event.velocityX < 0 ? -1 : 1;
          previewState.value = 0;
          translateX.value = withTiming(direction * cardWidth * 1.55, { duration: 145 });
          scheduleOnRN(commitChoice, direction);
        }),
    [cardWidth, disabled, leftOption, onChoose, onPreviewDirection, rightOption],
  );

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${(translateX.value / cardWidth) * 7}deg` },
    ],
  }));

  return (
    <View style={styles.stage}>
      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.card,
            {
              width: cardWidth,
              minHeight: cardHeight,
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.border,
            },
            animatedCardStyle,
          ]}
        >
          <View style={styles.header}>
            <View style={styles.speakerBlock}>
              <AppText variant="heading" style={styles.speakerName}>{conversation.speaker}</AppText>
              {conversation.role ? <AppText variant="caption" muted>{conversation.role}</AppText> : null}
            </View>
          </View>

          <View style={styles.scene}>
            <View style={[styles.visualFrame, { borderColor: theme.colors.border }]}>
              <CharacterPortrait name={conversation.speaker} />
              <AppText variant="caption" muted>
                {eventImage ? eventImage.credit : visual.label.toLocaleUpperCase('tr-TR')}
              </AppText>
            </View>
            <AppText style={styles.dialogue}>“{conversation.line}”</AppText>
          </View>

          <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
            <AppText variant="caption" muted>SOLA / SAĞA KAYDIR</AppText>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 26,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  header: { paddingHorizontal: 22, paddingTop: 20, gap: 14 },
  scene: { flex: 1, paddingHorizontal: 22, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 18 },
  visualFrame: {
    width: '100%',
    maxWidth: 390,
    minHeight: 156,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
  },
  speakerBlock: { alignItems: 'center', gap: 2 },
  speakerName: { textAlign: 'center', alignSelf: 'center', maxWidth: 420 },
  dialogue: { textAlign: 'center', maxWidth: 390, fontSize: 18, lineHeight: 27 },
  footer: { minHeight: 44, borderTopWidth: 1, paddingHorizontal: 18, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' },
});
