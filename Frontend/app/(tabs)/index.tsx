import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, TextInput } from 'react-native';

export default function HomeScreen() {
  type UserLoginInfoType={
    email:string;
    password:string;
  }
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPBASE_KEY;
  const [userLoginInfo,setUserLoginInfo]= useState<UserLoginInfoType>({email:'',password:''});

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

  async function signUpWithEmail() {
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: userLoginInfo.email,
      password: userLoginInfo.password,
    })
    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')

  }
  return (
    <SafeAreaView>
      <TextInput placeholder='email' value={userLoginInfo.email} onChangeText={(email: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, email}))}/>
      <TextInput placeholder='password' value={userLoginInfo.password} onChangeText={(password: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, password}))}/>
      <Button title='Create Account' onPress={signUpWithEmail} />
    </SafeAreaView>
    
  );
}

