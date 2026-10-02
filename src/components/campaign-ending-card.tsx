import { StyleSheet, View } from 'react-native';
import type { CampaignEnding } from '@/domain/game';
import { useAppTheme } from '@/theme';
import { AppButton } from './app-button';
import { AppText } from './app-text';

interface CampaignEndingCardProps {
  ending: CampaignEnding;
  playerName?: string;
  date: string;
  decisionCount: number;
  restarting?: boolean;
  onRestart: () => void;
}

export function CampaignEndingCard({
  ending,
  playerName,
  date,
  decisionCount,
  restarting = false,
  onRestart,
}: CampaignEndingCardProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.imagePlaceholder,
          {
            backgroundColor: theme.colors.surfaceElevated,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <View style={[styles.imageMark, { borderColor: theme.colors.border }]}>
          <AppText variant="label" muted>SON GÖRSELİ</AppText>
          <AppText variant="caption" muted>Resim daha sonra eklenecek</AppText>
        </View>
      </View>

      <View style={styles.story}>
        <AppText variant="caption" muted style={styles.classification}>
          {ending.classification === 'HISTORICAL_FACT'
            ? 'TARİHSEL SINIR'
            : 'ALTERNATİF SON'}
        </AppText>

        <AppText variant="heading" style={styles.title}>
          {ending.title}
        </AppText>

        <AppText style={styles.subtitle}>
          {ending.subtitle}
        </AppText>

        {ending.pathLabel ? (
          <View style={styles.pathBlock}>
            <AppText variant="caption" muted style={styles.pathLabel}>
              İZLEDİĞİN YOL
            </AppText>
            <AppText style={styles.pathTitle}>{ending.pathLabel}</AppText>
            {ending.pathTraits?.length ? (
              <View style={styles.traits}>
                {ending.pathTraits.map((trait) => (
                  <View
                    key={trait}
                    style={[
                      styles.traitChip,
                      {
                        backgroundColor: theme.colors.surfaceElevated,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <AppText variant="caption">{trait}</AppText>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        <AppText muted style={styles.description}>
          {ending.description}
        </AppText>

        <AppText variant="caption" muted style={styles.meta}>
          {[playerName, date, `${decisionCount} karar`].filter(Boolean).join(' · ')}
        </AppText>

        <AppButton
          onPress={onRestart}
          disabled={restarting}
          style={styles.restartButton}
        >
          {restarting ? 'Yeniden Başlatılıyor…' : 'Yeniden Başla'}
        </AppButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 18,
    paddingHorizontal: 8,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1.35,
    borderWidth: 1,
    borderRadius: 22,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageMark: {
    minWidth: 190,
    minHeight: 92,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 18,
  },
  story: {
    width: '100%',
    alignItems: 'center',
    gap: 9,
  },
  classification: {
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  title: {
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 32,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 360,
    fontSize: 16,
    lineHeight: 22,
  },
  pathBlock: {
    width: '100%',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  pathLabel: {
    textAlign: 'center',
    letterSpacing: 1,
  },
  pathTitle: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 22,
  },
  traits: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 7,
  },
  traitChip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  description: {
    textAlign: 'center',
    maxWidth: 370,
    fontSize: 15,
    lineHeight: 22,
  },
  meta: {
    textAlign: 'center',
    marginTop: 3,
  },
  restartButton: {
    width: '100%',
    maxWidth: 310,
    marginTop: 8,
    borderRadius: 14,
  },
});
