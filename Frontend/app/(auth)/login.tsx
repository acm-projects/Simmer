import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, View, TextInput, Text, KeyboardAvoidingView, Platform, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';
import {SafeAreaView} from 'react-native-safe-area-context'
import {InputField} from '@/components/inputField'


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
    <View style={styles.container}>
      <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS === "ios" ? "padding": undefined}
      keyboardVerticalOffset={0}
      >
      <ScrollView>
        
      <View style={styles.header}>
      
      <Image source={require('../../assets/images/Simmer_Mascot.png')} style={styles.mascot}/>
      <Text style={styles.title}>Welcome Back!</Text>
      </View>
      
      <View style={styles.forum}>
      <InputField 
      label='Email'
      placeholder='Email' 
      value={userLoginInfo.email} 
      onChangeText={(email: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, email}))}
      style={styles.header}/>
      <InputField 
      label='Password'
      placeholder='Password' secureTextEntry={true}  value={userLoginInfo.password} onChangeText={(password: string)=>setUserLoginInfo((currentUserLoginInfo)=>({...currentUserLoginInfo, password}))}/>
      </View>
     <View style={styles.footer}>
     <TouchableOpacity onPress={signInWithEmail} style={styles.submitButton}>
               <Text style={styles.submitText} >Log In</Text>
             </TouchableOpacity>
      {error&&<Text>{error}</Text>}
      <Link href="/signup" style={{marginTop: 10}}><Text style={styles.noAccountText}>Don't have an account? <Text style={{color: '#EC888D'}} >Sign Up</Text></Text></Link>
   </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </View>

    
  )
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 70,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
   title:{
    marginTop:20,
    fontSize:25,
    color: '#9BA760',
    fontWeight: 'bold'
    

  },
  forum:{
    height:200,
    alignItems: 'center'

  },
  header:{
    flex:1,
    alignItems: 'center'

  },
  footer:{
    textAlign:'center',
    alignItems: 'center',
    justifyContent:'center',
    flex:6
  },
  submitButton:{
    backgroundColor: '#9BA760',
    borderRadius: 100,
    paddingHorizontal: 20,
    width:200,
    height: 50,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent:'center',
    marginTop: 20,

  },
  submitText:{
    color:'#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold'
  },
  policyContainer:{
    marginTop:20,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent:'center',
    marginBottom:15
  },
  policyText:{
    fontSize:14

  },
  bold:{
    fontWeight: 'bold',
  },
  noAccountText:{
    marginTop:10,
    fontSize:12
  },
  loginText:{
    color:'#EC888D'
  },
    mascot: {
      height: 300,
      width: 300,
      shadowColor:'#000',
      shadowRadius: 4,
      shadowOpacity: 1,
      shadowOffset: {width: 0, height: 2},
  },
});
