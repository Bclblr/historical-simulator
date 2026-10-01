import { useCallback, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import type { DecisionOption } from '@/domain/game';
import type { HistoricalEvent } from '@/domain/history';
import { useAppTheme } from '@/theme';
import { getCampaignConversation } from '@/content/germany-campaign';
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
  conversationOverride?: {
    speaker: string;
    role?: string;
    line: string;
  };
}

const PREVIEW_DISTANCE = 16;
const MIN_COMMIT_DISTANCE = 58;
const MAX_COMMIT_DISTANCE = 92;
const COMMIT_DISTANCE_RATIO = 0.2;
const COMMIT_VELOCITY = 560;
const VELOCITY_PROJECTION_SECONDS = 0.12;
const EXIT_DURATION_MS = 175;

export function SwipeDecisionCard({
  event,
  leftOption,
  rightOption,
  actorLabel,
  disabled = false,
  onChoose,
  onPreviewDirection,
  conversationOverride,
}: SwipeDecisionCardProps) {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const cardWidth = Math.min(Math.max(width - 58, 276), 390);
  const compactHeight = height < 760;
  const cardHeight = Math.min(
    Math.max(cardWidth * (compactHeight ? 0.9 : 0.96), 280),
    380,
  );
  const commitDistance = Math.min(
    MAX_COMMIT_DISTANCE,
    Math.max(MIN_COMMIT_DISTANCE, cardWidth * COMMIT_DISTANCE_RATIO),
  );
  const exitDistance = Math.max(width, cardWidth) + cardWidth * 0.45;

  const translateX = useSharedValue(0);
  const previewState = useSharedValue(0);
  const isCommitting = useSharedValue(false);

  const conversation =
    conversationOverride ??
    getCampaignConversation(event.id, actorLabel, event.summary);

  const notifyPreview = useCallback(
    (value: number) => {
      onPreviewDirection?.(value < 0 ? 'LEFT' : value > 0 ? 'RIGHT' : null);
    },
    [onPreviewDirection],
  );

  const commitChoice = useCallback(
    (direction: number) => {
      onPreviewDirection?.(null);
      onChoose(direction < 0 ? leftOption : rightOption);
    },
    [leftOption, onChoose, onPreviewDirection, rightOption],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-4, 4])
        .failOffsetY([-34, 34])
        .onUpdate((gestureEvent) => {
          if (isCommitting.value) return;

          translateX.value = gestureEvent.translationX;

          const nextPreview =
            gestureEvent.translationX < -PREVIEW_DISTANCE
              ? -1
              : gestureEvent.translationX > PREVIEW_DISTANCE
                ? 1
                : 0;

          if (nextPreview !== previewState.value) {
            previewState.value = nextPreview;
            scheduleOnRN(notifyPreview, nextPreview);
          }
        })
        .onEnd((gestureEvent) => {
          if (isCommitting.value) return;

          const projectedX =
            gestureEvent.translationX +
            gestureEvent.velocityX * VELOCITY_PROJECTION_SECONDS;

          const distanceCommitted = Math.abs(projectedX) >= commitDistance;
          const velocityCommitted = Math.abs(gestureEvent.velocityX) >= COMMIT_VELOCITY;

          if (!distanceCommitted && !velocityCommitted) {
            translateX.value = withSpring(0, {
              damping: 19,
              stiffness: 245,
              mass: 0.72,
            });

            if (previewState.value !== 0) {
              previewState.value = 0;
              scheduleOnRN(notifyPreview, 0);
            }
            return;
          }

          const directionSource =
            Math.abs(projectedX) >= commitDistance
              ? projectedX
              : gestureEvent.velocityX;
          const direction = directionSource < 0 ? -1 : 1;

          isCommitting.value = true;
          previewState.value = 0;

          translateX.value = withTiming(
            direction * exitDistance,
            {
              duration: EXIT_DURATION_MS,
              easing: Easing.out(Easing.cubic),
            },
            (finished) => {
              if (finished) {
                scheduleOnRN(commitChoice, direction);
              } else {
                isCommitting.value = false;
              }
            },
          );
        }),
    [
      commitChoice,
      commitDistance,
      disabled,
      exitDistance,
      isCommitting,
      notifyPreview,
      previewState,
      translateX,
    ],
  );

  const animatedCardStyle = useAnimatedStyle(() => {
    const normalized = Math.max(-1, Math.min(1, translateX.value / cardWidth));

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${normalized * 8}deg` },
      ],
    };
  });

  const leftChoiceStyle = useAnimatedStyle(() => {
    const drag = Math.max(0, -translateX.value);
    const progress = Math.max(
      0,
      Math.min(1, (drag - PREVIEW_DISTANCE) / Math.max(1, commitDistance - PREVIEW_DISTANCE)),
    );

    return {
      opacity: progress,
      transform: [
        { translateY: 8 * (1 - progress) },
        { scale: 0.96 + progress * 0.04 },
      ],
    };
  });

  const rightChoiceStyle = useAnimatedStyle(() => {
    const drag = Math.max(0, translateX.value);
    const progress = Math.max(
      0,
      Math.min(1, (drag - PREVIEW_DISTANCE) / Math.max(1, commitDistance - PREVIEW_DISTANCE)),
    );

    return {
      opacity: progress,
      transform: [
        { translateY: 8 * (1 - progress) },
        { scale: 0.96 + progress * 0.04 },
      ],
    };
  });

  return (
    <View style={styles.stage}>
      <View style={styles.questionBlock}>
        <AppText
          numberOfLines={4}
          adjustsFontSizeToFit
          minimumFontScale={0.82}
          style={[
            styles.question,
            compactHeight ? styles.questionCompact : styles.questionRegular,
          ]}
        >
          “{conversation.line}”
        </AppText>
      </View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.card,
            {
              width: cardWidth,
              height: cardHeight,
              backgroundColor: theme.colors.surfaceElevated,
              borderColor: theme.colors.border,
            },
            animatedCardStyle,
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.choicePreview,
              styles.choicePreviewRight,
              { borderColor: theme.colors.border },
              leftChoiceStyle,
            ]}
          >
            <AppText variant="label" style={styles.choiceText}>{leftOption.label}</AppText>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.choicePreview,
              styles.choicePreviewLeft,
              { borderColor: theme.colors.border },
              rightChoiceStyle,
            ]}
          >
            <AppText variant="label" style={styles.choiceText}>{rightOption.label}</AppText>
          </Animated.View>

          <View style={styles.scene}>
            <CharacterPortrait name={conversation.speaker} fill />
          </View>
        </Animated.View>
      </GestureDetector>

      <View style={styles.identityBlock}>
        <AppText variant="heading" style={styles.speakerName}>
          {conversation.speaker}
        </AppText>
        {conversation.role ? (
          <AppText variant="caption" muted style={styles.speakerRole}>
            {conversation.role}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 0,
  },
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  choicePreview: {
    position: 'absolute',
    top: 18,
    zIndex: 20,
    maxWidth: '72%',
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  choicePreviewLeft: { left: 10, alignItems: 'flex-start' },
  choicePreviewRight: { right: 10, alignItems: 'flex-end' },
  choiceText: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 23,
  },
  questionBlock: {
    width: '100%',
    minHeight: 92,
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scene: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  identityBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    paddingHorizontal: 18,
    paddingBottom: 0,
    marginTop: 10,
  },
  speakerName: {
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 420,
    fontSize: 18,
    lineHeight: 21,
  },
  speakerRole: { textAlign: 'center', maxWidth: 390, fontSize: 13, lineHeight: 17 },
  question: {
    width: '100%',
    textAlign: 'center',
    maxWidth: 390,
    alignSelf: 'center',
  },
  questionCompact: {
    fontSize: 16,
    lineHeight: 21,
  },
  questionRegular: {
    fontSize: 17,
    lineHeight: 23,
  },
});
