import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Button, SafeAreaView, TextInput ,Text} from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const supabase=useSupabase();
  const router= useRouter();
  const [user,setUser]=useState<string|undefined>('')
  useEffect(()=>{
    const getUser=async ()=>{
      const { data: { session } } = await supabase.auth.getSession();
      if(!session)
        return;
      setUser(session.user.email);
    }
    getUser();

  })
  
  const logout=async ()=>{
    const { error } = await supabase.auth.signOut();
  }

  
  return (
    <SafeAreaView>
     <Text>hi {user}</Text>
     <Button title='logout' onPress={logout}/>
    </SafeAreaView>
    
  );
}

