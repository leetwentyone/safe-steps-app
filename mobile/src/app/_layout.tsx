import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AssistanceProvider } from '@/contexts/assistance-context';
import { VolunteerAuthProvider } from '@/contexts/volunteer-auth-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <VolunteerAuthProvider>
        <AssistanceProvider>
          <AnimatedSplashOverlay />

          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />

            <Stack.Screen
              name="staff-login"
              options={{
                headerShown: true,
                title: 'Staff Login',
              }}
            />
          </Stack>
        </AssistanceProvider>
      </VolunteerAuthProvider>
    </ThemeProvider>
  );
}