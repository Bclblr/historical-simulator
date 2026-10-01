import type { DeskFile, GameState } from '@/domain/game';
import { StyleSheet, View } from 'react-native';
import { getScenarioForSelection } from '@/content/scenario-catalog';
import { useAppTheme } from '@/theme';
import { AppCard } from './app-card';
import { AppText } from './app-text';
import { DocumentEntrance } from './document-entrance';

interface DeskScreenProps {
  state: GameState;
  activeFile?: DeskFile | null;
}

export function DeskScreen({ state, activeFile = null }: DeskScreenProps) {
  const theme = useAppTheme();
  const scenario = getScenarioForSelection(
    state.selection.eraId,
    state.selection.countryId,
  );
  const institution = scenario?.institutions.find(
    (item) => item.id === state.selection.institutionId,
  );
  const role = scenario?.roles.find(
    (item) => item.id === state.selection.roleId,
  );

  return (
    <View style={styles.root}>
      <View style={styles.hud}>
        <View style={styles.hudBlock}>
          <AppText variant="label" muted>TARİH</AppText>
          <AppText variant="title" style={styles.date}>{state.currentDate}</AppText>
        </View>
        <View style={styles.hudMeta}>
          <View style={[styles.badge, { borderColor: theme.colors.border }]}>
            <AppText variant="label">TARİHSEL KAYIT</AppText>
          </View>
          <View style={[styles.badge, { borderColor: theme.colors.border }]}>
            <AppText variant="label">{state.selection.eraId}</AppText>
          </View>
        </View>
      </View>

      <View style={styles.contextRow}>
        <AppCard style={styles.contextCard}>
          <AppText variant="label" muted>DEVLET</AppText>
          <AppText>{scenario?.countryId === 'germany' ? 'Germany' : state.selection.countryId}</AppText>
        </AppCard>
        <AppCard style={styles.contextCard}>
          <AppText variant="label" muted>KURUM</AppText>
          <AppText>{institution?.name ?? state.selection.institutionId}</AppText>
        </AppCard>
        <AppCard style={styles.contextCard}>
          <AppText variant="label" muted>GÖREV</AppText>
          <AppText>{role?.shortName ?? role?.name ?? state.selection.roleId}</AppText>
        </AppCard>
      </View>

      <DocumentEntrance delay={80}>
        <AppCard style={styles.activeFile}>
        <View style={styles.fileHeader}>
          <AppText variant="label" muted>AKTİF DOSYA</AppText>
          <AppText variant="label" muted>
            {activeFile ? 'SİMÜLASYON DOSYASI' : 'BEKLEMEDE'}
          </AppText>
        </View>
        <AppText variant="title" style={styles.fileTitle}>
          {activeFile?.title ?? 'Yeni dosya bekleniyor'}
        </AppText>
        <AppText muted style={styles.fileBody}>
          {activeFile
            ? `${activeFile.documentIds.length} belge · Durum: ${activeFile.status}`
            : 'Event Engine tarafından uygun bulunan olaylar bu çalışma alanına gelecek.'}
        </AppText>
        </AppCard>
      </DocumentEntrance>

      <View style={[styles.deskEdge, { borderColor: theme.colors.border }]}>
        <AppText muted>Dosyalar · Telgraflar · Gazeteler · Belgeler</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', maxWidth: 860, alignSelf: 'center', gap: 18 },
  hud: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  hudBlock: { flex: 1 },
  hudMeta: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 },
  date: { marginTop: 6 },
  badge: { paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1 },
  contextRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  contextCard: { flexGrow: 1, flexBasis: 180, gap: 7, padding: 14 },
  activeFile: {
    minHeight: 260,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 2,
  },
  fileHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  fileTitle: { marginTop: 12 },
  fileBody: { marginTop: 14, maxWidth: 520 },
  deskEdge: { borderTopWidth: 1, paddingTop: 16, alignItems: 'center' },
});
