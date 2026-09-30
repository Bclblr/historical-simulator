import type { DeskFile, GameState } from '@/domain/game';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/theme';
import { AppCard } from './app-card';
import { AppText } from './app-text';

interface DeskScreenProps {
  state: GameState;
  activeFile?: DeskFile | null;
}

export function DeskScreen({ state, activeFile = null }: DeskScreenProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <AppText variant="label" muted>ÇALIŞMA MASASI</AppText>
          <AppText variant="title" style={styles.date}>{state.currentDate}</AppText>
        </View>
        <View style={[styles.seal, { borderColor: theme.colors.border }]}>
          <AppText variant="label">{state.selection.countryId}</AppText>
        </View>
      </View>

      <AppCard style={styles.activeFile}>
        <AppText variant="label" muted>AKTİF DOSYA</AppText>
        <AppText variant="title" style={styles.fileTitle}>
          {activeFile?.title ?? 'Yeni dosya bekleniyor'}
        </AppText>
        <AppText muted style={styles.fileBody}>
          {activeFile
            ? `${activeFile.documentIds.length} belge · Durum: ${activeFile.status}`
            : 'Event Engine tarafından uygun bulunan olaylar bu çalışma alanına gelecek.'}
        </AppText>
      </AppCard>

      <View style={styles.tray}>
        <AppCard style={styles.trayItem}>
          <AppText variant="label" muted>KURUM</AppText>
          <AppText>{state.selection.institutionId}</AppText>
        </AppCard>
        <AppCard style={styles.trayItem}>
          <AppText variant="label" muted>GÖREV</AppText>
          <AppText>{state.selection.roleId}</AppText>
        </AppCard>
      </View>

      <View style={[styles.deskEdge, { borderColor: theme.colors.border }]}>
        <AppText muted>
          Dosyalar · Telgraflar · Gazeteler · Belgeler
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { width: '100%', maxWidth: 760, alignSelf: 'center', gap: 18 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  headerCopy: { flex: 1 },
  date: { marginTop: 6 },
  seal: { minWidth: 112, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, alignItems: 'center' },
  activeFile: { minHeight: 260, justifyContent: 'center' },
  fileTitle: { marginTop: 12 },
  fileBody: { marginTop: 14, maxWidth: 520 },
  tray: { flexDirection: 'row', gap: 14 },
  trayItem: { flex: 1, gap: 8 },
  deskEdge: { borderTopWidth: 1, paddingTop: 16, alignItems: 'center' },
});
