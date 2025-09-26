import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, TextInput } from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';


export default function Signup() {
  const router= useRouter();
  type UserLoginInfoType={
    email:string;
    password:string;
  }

  const [userLoginInfo,setUserLoginInfo]= useState<UserLoginInfoType>({email:'',password:''});
  const supabase=useSupabase();

  
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
      <TextInput placeholder='password' secureTextEntry={true} value={userLoginInfo.password} onChangeText={(password: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, password}))}/>
      <Button title='Create Account' onPress={signUpWithEmail} />
      <Link href="/login">already have an account?</Link>
    </SafeAreaView>
  )
}
