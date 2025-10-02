import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, View, TextInput, Text } from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';
import {SafeAreaView} from 'react-native-safe-area-context'


export default function Login() {
  const router= useRouter();
  type UserLoginInfoType={
    email:string;
    password:string;
  }

  const [userLoginInfo,setUserLoginInfo]= useState<UserLoginInfoType>({email:'',password:''});
  const [error, setError]= useState<string|null>(null)
  const supabase=useSupabase();

  
  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: userLoginInfo.email,
      password: userLoginInfo.password,
    })
    if (error){
      if(!error.status){
        setError('Something is wrong with our servers, please try again later.')
        return
      }

      if(error.status===429)
        setError("Too many requests. Please try again later.")
      else if(error.status<<500 && error.status>=400)
        setError('Invalid email or password. Please Try again.')
      else
        setError('Something is wrong with our servers, please try again later.')
    }
  }


  return (
    <View>
      <TextInput placeholder='email' value={userLoginInfo.email} onChangeText={(email: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, email}))}/>
      <TextInput placeholder='password' secureTextEntry={true}  value={userLoginInfo.password} onChangeText={(password: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, password}))}/>
      <Button title='login' onPress={signInWithEmail} />
      {error&&<Text>{error}</Text>}
      <Link href="/signup">{`don't have an account?`}</Link>
    </View>
  )
}
