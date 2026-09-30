import { Stack } from 'expo-router';

export default function SetupLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Geri',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#F1EBDD' },
        contentStyle: { backgroundColor: '#F1EBDD' },
      }}
    />
  );
}
