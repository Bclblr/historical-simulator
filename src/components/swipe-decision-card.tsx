import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import type { DecisionOption } from '@/domain/game';
import type { HistoricalEvent } from '@/domain/history';
import { useAppTheme } from '@/theme';
import { AppText } from './app-text';

interface SwipeDecisionCardProps {
  event: HistoricalEvent;
  leftOption: DecisionOption;
  rightOption: DecisionOption;
  disabled?: boolean;
  onChoose: (option: DecisionOption) => void;
}

const SWIPE_THRESHOLD = 110;

export function SwipeDecisionCard({
  event,
  leftOption,
  rightOption,
  disabled = false,
  onChoose,
}: SwipeDecisionCardProps) {
  const theme = useAppTheme();
  const { width, height } = useWindowDimensions();
  const position = useRef(new Animated.ValueXY()).current;
  const [direction, setDirection] = useState<'LEFT' | 'RIGHT' | null>(null);
  const cardWidth = Math.min(Math.max(width - 32, 280), 520);
  const cardHeight = Math.min(Math.max(height * 0.54, 390), 590);

  const rotate = position.x.interpolate({
    inputRange: [-cardWidth, 0, cardWidth],
    outputRange: ['-9deg', '0deg', '9deg'],
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          !disabled && Math.abs(gesture.dx) > 6,
        onPanResponderMove: (_, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy * 0.12 });
          setDirection(gesture.dx < -20 ? 'LEFT' : gesture.dx > 20 ? 'RIGHT' : null);
        },
        onPanResponderRelease: (_, gesture) => {
          const committed = Math.abs(gesture.dx) >= SWIPE_THRESHOLD;
          if (!committed) {
            setDirection(null);
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
            }).start();
            return;
          }

          const option = gesture.dx < 0 ? leftOption : rightOption;
          Animated.timing(position, {
            toValue: { x: gesture.dx < 0 ? -cardWidth * 1.5 : cardWidth * 1.5, y: 0 },
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            position.setValue({ x: 0, y: 0 });
            setDirection(null);
            onChoose(option);
          });
        },
        onPanResponderTerminate: () => {
          setDirection(null);
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        },
      }),
    [cardWidth, disabled, leftOption, onChoose, position, rightOption],
  );

  return (
    <View style={styles.root}>
      <View style={styles.choiceRow}>
        <AppText style={styles.choice} muted>← {leftOption.label}</AppText>
        <AppText style={[styles.choice, styles.choiceRight]} muted>{rightOption.label} →</AppText>
      </View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            width: cardWidth,
            minHeight: cardHeight,
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            transform: [...position.getTranslateTransform(), { rotate }],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <AppText variant="label" muted>{event.startDate}</AppText>
          <AppText variant="label" muted>KARAR DOSYASI</AppText>
        </View>

        {direction ? (
          <View style={[styles.preview, { borderColor: theme.colors.primary }]}>
            <AppText variant="label">
              {direction === 'LEFT' ? leftOption.label : rightOption.label}
            </AppText>
          </View>
        ) : null}

        <View style={styles.body}>
          <AppText variant="title" style={styles.title}>{event.title}</AppText>
          <AppText>{event.summary}</AppText>
        </View>

        <AppText variant="caption" muted style={styles.hint}>
          Karar vermek için kartı sola veya sağa kaydır.
        </AppText>
      </Animated.View>

      <AppText variant="caption" muted style={styles.disclaimer}>
        Karttaki olay tarihsel kayıttır. Sola/sağa seçimler karşı-olgusal oyun kararlarıdır.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', alignItems: 'center', paddingVertical: 12, gap: 12 },
  choiceRow: {
    width: '100%',
    maxWidth: 520,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  choice: { flex: 1 },
  choiceRight: { textAlign: 'right' },
  card: {
    borderWidth: 1,
    padding: 22,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  preview: { alignSelf: 'center', borderWidth: 2, paddingHorizontal: 14, paddingVertical: 9 },
  body: { gap: 18 },
  title: { textAlign: 'center' },
  hint: { textAlign: 'center', marginTop: 20 },
  disclaimer: { maxWidth: 520, textAlign: 'center' },
});
