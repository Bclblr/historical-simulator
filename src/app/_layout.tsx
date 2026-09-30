import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppDatabaseProvider } from '@/data/db';
import { AppThemeProvider, useAppTheme } from '@/theme';

function RootNavigator() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: theme.colors.background },
          headerTintColor: theme.colors.text,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <AppDatabaseProvider>
      <AppThemeProvider>
        <RootNavigator />
      </AppThemeProvider>
    </AppDatabaseProvider>
  );
}
