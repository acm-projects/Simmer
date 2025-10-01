import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, TextInput, Text } from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';
import { validateSignupInfo } from '../utils/validateSignupInfo';
import {SafeAreaView} from 'react-native-safe-area-context'

export default function Signup() {
  const router= useRouter();
  type UserSignupInfoType={
    email:string;
    password:string;
    first_name:string;
    last_name:string;
  }

  const [userSignupInfo,setUserSignupInfo]= useState<UserSignupInfoType>({email:'',password:'', first_name:'',last_name:''});
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
      if (error){ 
        setError(error.message)
        return;
      }
      if(!session){
        setError(`Session doesn't exist, please try again.`)
        return;
      }
      if(!process.env.EXPO_PUBLIC_API_URL){
        setError('There is something wrong with the API URL, please try again.')
        return

      }
      try{
        await fetch(`${process.env.EXPO_PUBLIC_API_URL}create_user`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                first_name: userSignupInfo.first_name,
                last_name: userSignupInfo.last_name,
                email: userSignupInfo.email,
                id: session.user.id

            })
        })
      }catch(error){
        console.error('Fetch error:', error);
      }
      //
    }
  }

  return (
    <SafeAreaView>
      <TextInput placeholder='First Name' value={userSignupInfo.first_name} onChangeText={(first_name: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, first_name}))}/>
      <TextInput placeholder='Last Name' secureTextEntry={true} value={userSignupInfo.last_name} onChangeText={(last_name: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, last_name}))}/>
      <TextInput placeholder='email' value={userSignupInfo.email} onChangeText={(email: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, email}))}/>
      <TextInput placeholder='password' secureTextEntry={true} value={userSignupInfo.password} onChangeText={(password: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, password}))}/>
      <Button title='Create Account' onPress={signUpWithEmail} />
      {error&&<Text>{error}</Text>}
      <Link href="/login">already have an account?</Link>
    </SafeAreaView>
  )
}
