import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseProvider, useSupabase } from './contexts/SupabaseContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  
  const supabase=useSupabase();

  const router= useRouter();

  useEffect(()=>{
    const authenticateUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        router.navigate("/signup");
        return;
      } else {
        router.navigate("/userPreference");
      }
    }

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
    if (event === 'INITIAL_SESSION') {
      authenticateUser()
    } else if (event === 'SIGNED_IN') {
      router.navigate('/userPreference');
    } else if (event === 'SIGNED_OUT') {
      router.navigate('/signup')
    } else if (event === 'PASSWORD_RECOVERY') {
      // handle password recovery event
    } else if (event === 'TOKEN_REFRESHED') {
      // handle token refreshed event
    } else if (event === 'USER_UPDATED') {
      // handle user updated event
    }
  })

  },[])
  const colorScheme = useColorScheme();

  return (
    <SupabaseProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SupabaseProvider>
  );
}
