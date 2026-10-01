import { StyleSheet, View } from 'react-native';
import { AppText } from './app-text';

type PortraitKey = 'drexler' | 'mayr' | 'strasser' | 'goering' | 'roehm' | 'himmler' | 'advisor';

const aliases: Array<[RegExp, PortraitKey]> = [
  [/anton drexler/i, 'drexler'],
  [/karl mayr/i, 'mayr'],
  [/gregor strasser/i, 'strasser'],
  [/hermann göring|hermann goering/i, 'goering'],
  [/ernst röhm|ernst roehm/i, 'roehm'],
  [/heinrich himmler/i, 'himmler'],
];

const traits: Record<PortraitKey, { hair: string; coat: string; glasses?: boolean; hat?: boolean; initials: string }> = {
  drexler: { hair: '#2A211D', coat: '#3A2A24', initials: 'AD' },
  mayr: { hair: '#25201D', coat: '#30363A', glasses: true, initials: 'KM' },
  strasser: { hair: '#3B3029', coat: '#292725', initials: 'GS' },
  goering: { hair: '#4B3A2D', coat: '#4A493E', hat: true, initials: 'HG' },
  roehm: { hair: '#3A3028', coat: '#4A4034', hat: true, initials: 'ER' },
  himmler: { hair: '#272421', coat: '#323232', glasses: true, initials: 'HH' },
  advisor: { hair: '#39312C', coat: '#35383A', initials: 'D' },
};

function keyFor(name: string): PortraitKey {
  return aliases.find(([pattern]) => pattern.test(name))?.[1] ?? 'advisor';
}

export function CharacterPortrait({ name }: { name: string }) {
  const t = traits[keyFor(name)];

  return (
    <View style={styles.frame}>
      <View style={styles.backdrop} />
      <View style={[styles.shoulders, { backgroundColor: t.coat }]} />
      <View style={styles.neck} />
      <View style={styles.head}>
        <View style={[styles.hair, { backgroundColor: t.hair }]} />
        <View style={styles.earLeft} />
        <View style={styles.earRight} />
        <View style={styles.browLeft} />
        <View style={styles.browRight} />
        <View style={styles.eyeLeft} />
        <View style={styles.eyeRight} />
        {t.glasses ? (
          <>
            <View style={styles.glassLeft} />
            <View style={styles.glassRight} />
            <View style={styles.glassBridge} />
          </>
        ) : null}
        <View style={styles.nose} />
        <View style={styles.mouth} />
      </View>
      {t.hat ? <View style={[styles.hat, { backgroundColor: t.coat }]} /> : null}
      <View style={styles.initialBadge}>
        <AppText variant="caption" style={styles.initials}>{t.initials}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { width: '100%', height: 230, overflow: 'hidden', borderRadius: 18, position: 'relative', backgroundColor: '#171717' },
  backdrop: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 92, backgroundColor: '#25211F' },
  shoulders: { position: 'absolute', width: 210, height: 105, borderRadius: 80, bottom: -38, alignSelf: 'center', left: '50%', marginLeft: -105 },
  neck: { position: 'absolute', width: 45, height: 45, backgroundColor: '#C98D69', bottom: 53, left: '50%', marginLeft: -22 },
  head: { position: 'absolute', width: 112, height: 140, borderRadius: 42, backgroundColor: '#D79A72', top: 35, left: '50%', marginLeft: -56, overflow: 'visible' },
  hair: { position: 'absolute', left: 3, right: 5, top: 0, height: 38, borderTopLeftRadius: 40, borderTopRightRadius: 34, transform: [{ skewX: '-8deg' }] },
  earLeft: { position: 'absolute', width: 18, height: 34, borderRadius: 12, backgroundColor: '#C88764', left: -10, top: 58 },
  earRight: { position: 'absolute', width: 18, height: 34, borderRadius: 12, backgroundColor: '#C88764', right: -10, top: 58 },
  browLeft: { position: 'absolute', width: 25, height: 4, backgroundColor: '#3A2922', left: 18, top: 55, transform: [{ rotate: '-5deg' }] },
  browRight: { position: 'absolute', width: 25, height: 4, backgroundColor: '#3A2922', right: 18, top: 55, transform: [{ rotate: '5deg' }] },
  eyeLeft: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: '#171717', left: 29, top: 67 },
  eyeRight: { position: 'absolute', width: 7, height: 7, borderRadius: 4, backgroundColor: '#171717', right: 29, top: 67 },
  glassLeft: { position: 'absolute', width: 31, height: 25, borderRadius: 13, borderWidth: 2, borderColor: '#171717', left: 15, top: 58 },
  glassRight: { position: 'absolute', width: 31, height: 25, borderRadius: 13, borderWidth: 2, borderColor: '#171717', right: 15, top: 58 },
  glassBridge: { position: 'absolute', width: 14, height: 2, backgroundColor: '#171717', left: 49, top: 69 },
  nose: { position: 'absolute', width: 13, height: 28, borderRightWidth: 3, borderBottomWidth: 3, borderColor: '#A96F50', left: 49, top: 68, transform: [{ skewX: '-8deg' }] },
  mouth: { position: 'absolute', width: 31, height: 3, backgroundColor: '#5A3029', left: 41, top: 112 },
  hat: { position: 'absolute', width: 126, height: 30, borderRadius: 8, top: 25, left: '50%', marginLeft: -63, transform: [{ rotate: '-2deg' }] },
  initialBadge: { position: 'absolute', right: 12, bottom: 10, minWidth: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 7 },
  initials: { color: '#F2E6D3' },
});
