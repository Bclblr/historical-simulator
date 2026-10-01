import { useMemo, useRef, useState } from 'react';
import { Animated, PanResponder, StyleSheet, useWindowDimensions, View } from 'react-native';
import type { DecisionOption } from '@/domain/game';
import type { HistoricalEvent } from '@/domain/history';
import { useAppTheme } from '@/theme';
import { AppText } from './app-text';

interface SwipeDecisionCardProps {
  event: HistoricalEvent;
  leftOption: DecisionOption;
  rightOption: DecisionOption;
  actorLabel: string;
  disabled?: boolean;
  onChoose: (option: DecisionOption) => void;
}

const SWIPE_THRESHOLD = 105;

export function SwipeDecisionCard({
  event,
  leftOption,
  rightOption,
  actorLabel,
  disabled = false,
  onChoose,
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

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => !disabled && Math.abs(gesture.dx) > 5,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy * 0.06 });
      setDirection(gesture.dx < -18 ? 'LEFT' : gesture.dx > 18 ? 'RIGHT' : null);
    },
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) < SWIPE_THRESHOLD) {
        setDirection(null);
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        return;
      }
      const option = gesture.dx < 0 ? leftOption : rightOption;
      Animated.timing(position, {
        toValue: { x: gesture.dx < 0 ? -cardWidth * 1.6 : cardWidth * 1.6, y: 0 },
        duration: 190,
        useNativeDriver: true,
      }).start(() => {
        position.setValue({ x: 0, y: 0 });
        setDirection(null);
        onChoose(option);
      });
    },
    onPanResponderTerminate: () => {
      setDirection(null);
      Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    },
  }), [cardWidth, disabled, leftOption, onChoose, position, rightOption]);

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
        <View style={[styles.topBand, { backgroundColor: theme.colors.primary }]}>
          <View style={styles.dateRow}>
            <AppText variant="label" style={{ color: theme.colors.onPrimary }}>{event.startDate}</AppText>
            <AppText variant="label" style={{ color: theme.colors.onPrimary }}>TARİHSEL OLAY</AppText>
          </View>
          <AppText variant="heading" style={[styles.prompt, { color: theme.colors.onPrimary }]}>
            {choice?.label ?? event.title}
          </AppText>
        </View>

        <View style={styles.scene}>
          <View style={[styles.emblem, { borderColor: theme.colors.accent }]}>
            <AppText variant="display">§</AppText>
          </View>
          <AppText style={styles.summary}>{event.summary}</AppText>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <AppText variant="label" muted>{actorLabel}</AppText>
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
  topBand: { minHeight: 150, padding: 20, justifyContent: 'space-between' },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  prompt: { textAlign: 'center', marginTop: 20 },
  scene: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 26 },
  emblem: {
    width: 116,
    height: 116,
    borderWidth: 2,
    borderRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: { textAlign: 'center', maxWidth: 390 },
  footer: { minHeight: 92, borderTopWidth: 1, padding: 18, justifyContent: 'space-between', gap: 10 },
});
