import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { COLORS } from '@/constants/colors';

/** Auth group layout  no tab bar visible on auth screens */
export default function AuthLayout() {
  const scheme = (useColorScheme() === 'dark' ? 'dark' : 'light');

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS[scheme].background },
        animation: 'slide_from_right',
      }}
    />
  );
}
