import { Stack } from 'expo-router';
import { useAppTheme } from '@/theme';

export default function SetupLayout() {
  const theme = useAppTheme();
  return <Stack screenOptions={{ headerBackTitle: 'Geri', headerShadowVisible: false, headerStyle: { backgroundColor: theme.colors.background }, headerTintColor: theme.colors.text, contentStyle: { backgroundColor: theme.colors.background } }} />;
}
