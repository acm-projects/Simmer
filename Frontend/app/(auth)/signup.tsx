import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, TextInput, Text } from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';
import { validateSignupInfo } from '../utils/validateSignupInfo';


export default function Signup() {
  const router= useRouter();
  type UserSignupInfoType={
    email:string;
    password:string;
  }

  const [userSignupInfo,setUserSignupInfo]= useState<UserSignupInfoType>({email:'',password:''});
  const [error, setError]= useState<string|null>(null)
  const supabase=useSupabase();

  
  async function signUpWithEmail() {
    if(validateSignupInfo(userSignupInfo, setError)){
      const {
        data: { session },
        error,
      } = await supabase.auth.signUp({
        email: userSignupInfo.email,
        password: userSignupInfo.password,
      })
      if (error) setError(error.message)
    }
  }

  return (
    <SafeAreaView>
      <TextInput placeholder='email' value={userSignupInfo.email} onChangeText={(email: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, email}))}/>
      <TextInput placeholder='password' secureTextEntry={true} value={userSignupInfo.password} onChangeText={(password: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, password}))}/>
      <Button title='Create Account' onPress={signUpWithEmail} />
      {error&&<Text>{error}</Text>}
      <Link href="/login">already have an account?</Link>
    </SafeAreaView>
  )
}
