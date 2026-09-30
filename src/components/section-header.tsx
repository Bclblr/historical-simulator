import { StyleSheet, View } from 'react-native';
import { AppText } from './app-text';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <View>
      {eyebrow ? <AppText variant="label" muted>{eyebrow}</AppText> : null}
      <AppText variant="title" style={styles.title}>{title}</AppText>
      {description ? <AppText muted style={styles.description}>{description}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 8 },
  description: { marginTop: 10, maxWidth: 560 },
});
