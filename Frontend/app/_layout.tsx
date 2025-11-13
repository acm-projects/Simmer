import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { SupabaseProvider, useSupabase } from './contexts/SupabaseContext';
import { RecipeProvider } from './contexts/RecipeContext';
import { getCollections, getRecipes } from './utils/recipe';
import { UserProvider } from './contexts/UserContext';
import { CollectionProvider } from './contexts/CollectionContext';
import { FavoriteRecipeProvider } from './contexts/FavoriteRecipeContext';
import { SearchRecipeProvider } from './contexts/SearchRecipeContext';
import { fetchUser } from './api/userApi';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  
  const supabase=useSupabase();

  const router= useRouter();
  const [user,setUser]=useState<any[] | undefined>(undefined)
  const [collections,setCollections]=useState<any[] | undefined>(undefined)
  const [recipes,setRecipes]=useState<any[] | undefined>(undefined)
  const [favriteRecipes,setFavoriteRecipes]=useState<any[] | undefined>([])
  const [searchRecipes,setSearchRecipes]=useState<any[] | undefined>([])
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const refreshUser = async () => {
      try {
        const data = await fetchUser();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
  useEffect(() => {
    setIsNavigationReady(true);
  }, []); 
  useEffect(()=>{
    if(recipes)
      setFavoriteRecipes(recipes?recipes.filter((recipe)=>recipe.user_favorites.length>0):[])
      setSearchRecipes(recipes);
  },[recipes])

  useEffect(()=>{
    if (!isNavigationReady) {
      return;
    }
    const getUser= async (jwt:string|undefined)=>{
      try{
        const response =  await fetch(`${process.env.EXPO_PUBLIC_API_URL}user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
          }
        });
        const data=await response.json()
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
        console.log(data.data)
        setUser(data.data)
      } catch (err) {
        console.error( err);
        alert("Could not connect to server");
      }

    }
    
    const authenticateUser = async (jwt:string|undefined) => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        router.navigate("/signup");
        return;
      } else {
      }
    }

    const { data } = supabase.auth.onAuthStateChange( async (event, session) => {
    console.log(event, session)
    if (event === 'INITIAL_SESSION') {
      await authenticateUser(session?.access_token)
    } else if (event === 'SIGNED_IN') {
      await getUser(session?.access_token)
      await getRecipes(session?.access_token, setRecipes);
      await getCollections(session?.access_token, setCollections);
      router.navigate("/userPreference");
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

  },[isNavigationReady,supabase, router])
  const colorScheme = useColorScheme();

  return (
    <SearchRecipeProvider searchRecipes={searchRecipes} setSearchRecipes={setSearchRecipes}>
    <FavoriteRecipeProvider favoriteRecipes={favriteRecipes} setFavoriteRecipes={setFavoriteRecipes}>
    <CollectionProvider collections={collections} setCollections={setCollections}>
    <UserProvider user={user} setUser={setUser} refreshUser={fetchUser}>
    <RecipeProvider recipes={recipes} setRecipes={setRecipes}>
    <SupabaseProvider>
      <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="screens/search" options={{ headerShown: false }} />
          <Stack.Screen name="screens/settings" options={{ headerShown: false }} />
          <Stack.Screen name="screens/cookingMode" options={{ headerShown: false }} />
          <Stack.Screen name="screens/importRecipe" options={{ headerShown: false }} />
          <Stack.Screen name="screens/description/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="screens/recipeCollection/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="screens/recipeCollection" options={{ headerShown: false }} />
          <Stack.Screen name="screens/profilePage" options={{ headerShown: false }} />
          <Stack.Screen name="userPreference" options={{ headerShown: false }} />
          <Stack.Screen name="voiceAssistant" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SupabaseProvider>
    </RecipeProvider>
    </UserProvider>
    </CollectionProvider>
    </FavoriteRecipeProvider>
    </SearchRecipeProvider>

  );
}
