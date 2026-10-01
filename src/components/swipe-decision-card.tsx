import { useMemo, useRef, useState } from 'react';
import { Animated, Image, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
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

const SWIPE_THRESHOLD = 72;
const SWIPE_VELOCITY = 0.35;

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
  const position = useRef(new Animated.ValueXY()).current;
  const [direction, setDirection] = useState<'LEFT' | 'RIGHT' | null>(null);
  const cardWidth = Math.min(Math.max(width - 28, 292), 520);
  const cardHeight = Math.min(Math.max(height * 0.67, 500), 680);

  const rotate = position.x.interpolate({
    inputRange: [-cardWidth, 0, cardWidth],
    outputRange: ['-8deg', '0deg', '8deg'],
  });
  const choice = direction === 'LEFT' ? leftOption : direction === 'RIGHT' ? rightOption : null;
  const visualEventId = event.id.endsWith(':follow-up')
    ? event.id.slice(0, -':follow-up'.length)
    : event.id;
  const visual = getGermany1933CardVisual(visualEventId);
  const eventImage = getCampaignEventImage(visualEventId);
  const conversation = getCampaignConversation(event.id, actorLabel, event.summary);
  const classificationLabel =
    event.classification === 'COUNTERFACTUAL_SIMULATION'
      ? 'SİMÜLASYON SONUCU'
      : 'TARİHSEL OLAY';

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) =>
      !disabled && Math.abs(gesture.dx) > 3 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderTerminationRequest: () => false,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
      const nextDirection = gesture.dx < -18 ? 'LEFT' : gesture.dx > 18 ? 'RIGHT' : null;
      setDirection(nextDirection);
      onPreviewDirection?.(nextDirection);
    },
    onPanResponderRelease: (_, gesture) => {
      const committed = Math.abs(gesture.dx) >= SWIPE_THRESHOLD || Math.abs(gesture.vx) >= SWIPE_VELOCITY;
      if (!committed) {
        setDirection(null);
        onPreviewDirection?.(null);
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        return;
      }
      const goLeft = gesture.dx !== 0 ? gesture.dx < 0 : gesture.vx < 0;
      const option = goLeft ? leftOption : rightOption;
      Animated.timing(position, {
        toValue: { x: goLeft ? -cardWidth * 1.45 : cardWidth * 1.45, y: 0 },
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
        setDirection(null);
        onPreviewDirection?.(null);
        onChoose(option);
      });
    },
    onPanResponderTerminate: () => {
      setDirection(null);
      onPreviewDirection?.(null);
      Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    },
  }), [cardWidth, disabled, leftOption, onChoose, onPreviewDirection, position, rightOption]);

  return (
    <View style={styles.stage}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            width: cardWidth,
            minHeight: cardHeight,
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
            transform: [...position.getTranslateTransform(), { rotate }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.dateRow}>
            <AppText variant="caption" muted>{event.startDate}</AppText>
            <AppText variant="caption" muted>{classificationLabel}</AppText>
          </View>
          <View style={styles.speakerBlock}>
            <AppText variant="heading" style={styles.speakerName}>{conversation.speaker}</AppText>
            {conversation.role ? <AppText variant="caption" muted>{conversation.role}</AppText> : null}
          </View>
          {choice ? (
            <View style={[styles.choicePreview, { borderColor: theme.colors.accent }]}>
              <AppText variant="label">{direction === 'LEFT' ? '← ' : ''}{choice.label}{direction === 'RIGHT' ? ' →' : ''}</AppText>
            </View>
          ) : null}
        </View>

        <View style={styles.scene}>
          <View style={[styles.visualFrame, { borderColor: theme.colors.border }]}>
            <CharacterPortrait name={conversation.speaker} />
            {eventImage ? (
              <AppText variant="caption" muted>{eventImage.credit}</AppText>
            ) : (
              <AppText variant="caption" muted>{visual.label.toLocaleUpperCase('tr-TR')}</AppText>
            )}
          </View>
          <AppText style={styles.dialogue}>“{conversation.line}”</AppText>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <AppText variant="caption" muted>{event.title}</AppText>
          <AppText variant="caption" muted>
            {choice ? (direction === 'LEFT' ? '← SOL KARAR' : 'SAĞ KARAR →') : 'KARTI SOLA / SAĞA KAYDIR'}
          </AppText>
        </View>
      </Animated.View>
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
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  header: { paddingHorizontal: 22, paddingTop: 20, gap: 14 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  scene: { flex: 1, paddingHorizontal: 22, paddingVertical: 18, alignItems: 'center', justifyContent: 'center', gap: 18 },
  emblem: {
    width: 116,
    height: 116,
    borderWidth: 2,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  eventImage: {
    width: '100%',
    height: 190,
    borderRadius: 14,
  },
  visualBadge: {
    width: 96,
    height: 96,
    borderWidth: 2,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerBlock: { alignItems: 'center', gap: 2 },
  speakerName: { textAlign: 'center', alignSelf: 'center', maxWidth: 420 },
  choicePreview: { alignSelf: 'center', borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  dialogue: { textAlign: 'center', maxWidth: 390, fontSize: 18, lineHeight: 27 },
  footer: { minHeight: 64, borderTopWidth: 1, paddingHorizontal: 18, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
});
