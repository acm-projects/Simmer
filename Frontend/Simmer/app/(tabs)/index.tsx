// import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Platform, StyleSheet, Button , SafeAreaView, Text, TextInput, Alert} from 'react-native';
import { createClient, processLock} from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage'
import {SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY,GOOGLE_CLIENT_ID} from "@env"
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    ...(Platform.OS !== "ios" ? { storage: AsyncStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});



export default function HomeScreen() {
  type UserLoginInfoType={
    email:string;
    password:string;
  }
  const [userLoginInfo,setUserLoginInfo]= useState<UserLoginInfoType>({email:'',password:''});
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

