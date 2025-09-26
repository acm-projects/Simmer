import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import React, { createContext, useContext, useState, useEffect , ReactNode } from 'react';



const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPBASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Key is not defined in your .env file.");
}
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

const SupabaseContext = createContext(supabase);

export function useSupabase() {
  return useContext(SupabaseContext);
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
   

  return <SupabaseContext.Provider value={supabase}>{children}</SupabaseContext.Provider>;
}
