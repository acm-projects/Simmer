import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupabaseProvider, useSupabase } from './contexts/SupabaseContext';
import CookingModePage from './screens/cookingMode';
import { RecipeProvider } from './contexts/RecipeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  
  const supabase=useSupabase();

  const router= useRouter();
  const [recipes,setRecipes]=useState<any[] | undefined>(undefined)

  useEffect(()=>{
    const getRecipes=async(jwt:string|undefined)=>{
      try{
        const response =  await fetch(`${process.env.EXPO_PUBLIC_API_URL}recipes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
          }
        });
        const data=await response.json()
        console.log(data)
        setRecipes(data.result)
      } catch (err) {
        console.error( err);
        alert("Could not connect to server");
      }
    }
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
      console.log('-----------------------------------------')
      console.log(session?.access_token)
      getRecipes(session?.access_token);
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
    <RecipeProvider recipes={recipes} setRecipes={setRecipes}>
    <SupabaseProvider>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="screens/search" options={{ headerShown: false }} />
          <Stack.Screen name="screens/settings" options={{ headerShown: false }} />
          <Stack.Screen name="screens/cookingMode" options={{ headerShown: false }} />
          <Stack.Screen name="screens/importRecipe" options={{ headerShown: false }} />
          <Stack.Screen name="screens/description/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="screens/recipeCollection" options={{ headerShown: false }} />
          <Stack.Screen name="screens/profilePage" options={{ headerShown: false }} />
          <Stack.Screen name="userPreference" options={{ headerShown: false }} />
          <Stack.Screen name="voiceAssistant" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SupabaseProvider>
    </RecipeProvider>

  );
}
