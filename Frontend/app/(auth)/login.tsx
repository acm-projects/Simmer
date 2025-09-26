import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, TextInput } from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';


export default function Login() {
  const router= useRouter();
  type UserLoginInfoType={
    email:string;
    password:string;
  }

  const [userLoginInfo,setUserLoginInfo]= useState<UserLoginInfoType>({email:'',password:''});
  const supabase=useSupabase();

  
  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: userLoginInfo.email,
      password: userLoginInfo.password,
    })
    if (error) Alert.alert(error.message)
  }


  return (
    <SafeAreaView>
      <TextInput placeholder='email' value={userLoginInfo.email} onChangeText={(email: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, email}))}/>
      <TextInput placeholder='password' secureTextEntry={true}  value={userLoginInfo.password} onChangeText={(password: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, password}))}/>
      <Button title='login' onPress={signInWithEmail} />
      <Link href="/signup">{`don't have an account?`}</Link>
    </SafeAreaView>
  )
}
