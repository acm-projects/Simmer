import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, TextInput, Text , StyleSheet,View,TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image} from 'react-native';
import { useSupabase } from '../contexts/SupabaseContext';
import { validateSignupInfo } from '../utils/validateSignupInfo';
import {SafeAreaView} from 'react-native-safe-area-context'
import { InputField } from '@/components/inputField';


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
        await fetch(`${process.env.EXPO_PUBLIC_API_URL}user/create-user`, {
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
    <View style={styles.container}>
         <KeyboardAvoidingView 
         style={{flex: 1}}
         behavior={Platform.OS === "ios" ? "padding": undefined}
         keyboardVerticalOffset={0}
         >
           <ScrollView>
      <View style={styles.header}>
        <Image source={require('../../assets/images/Simmer_Mascot.png')} style={styles.mascot}/>
        <Text style={styles.title}>Sign Up</Text>
      </View>
      <View style={styles.forum}>
        <InputField label="First Name" placeholder='First Name' secureTextEntry={false} value={userSignupInfo.first_name} onChangeText={(first_name: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, first_name}))}/>
        <InputField label="Last Name" placeholder='Last Name' secureTextEntry={false} value={userSignupInfo.last_name} onChangeText={(last_name: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, last_name}))}/>
        <InputField label="Email" placeholder='Email' secureTextEntry={false} value={userSignupInfo.email} onChangeText={(email: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, email}))}/>
        <InputField label='Password' placeholder='Password' secureTextEntry={true} value={userSignupInfo.password} onChangeText={(password: string)=>setUserSignupInfo((currentUserSignupInfo)=>({...currentUserSignupInfo, password}))}/>
      </View>
      <View style={styles.footer}>
       {/* <View style={styles.policyContainer}>
          <Text style={styles.policyText}>By continuing, you agree to </Text>
          <Text style={styles.policyText}><Text style={styles.bold}>Terms of Use</Text> and <Text style={styles.bold}>Privacy Policy.</Text></Text>
        </View> */}
        <TouchableOpacity onPress={signUpWithEmail} style={styles.submitButton}>
          <Text style={styles.submitText} >Sign Up</Text>
        </TouchableOpacity>
        {error&&<Text>{error}</Text>}
        <Link href="/login" style={styles.noAccountText}>Already have an account? <Text style={styles.loginText}>Log In</Text></Link>
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
    paddingBottom: 10,
    alignItems: 'center'
  
  },
  title:{
    marginTop:5,
    fontSize:25,
    color: '#9BA760',
    fontWeight: 'bold',
  
  },
  forum:{
    height:400,
    width: '90%',

  },
  header:{
    alignItems: 'center'

  },
  footer:{
    textAlign:'center',
    alignItems: 'center',
    justifyContent:'center',
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
    fontWeight: 'bold',
  },
  policyContainer:{
    marginTop:20,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent:'center',
    fontSize:200,
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
      height: 200,
      width: 200,
      shadowColor:'#000',
      shadowRadius: 4,
      shadowOpacity: 1,
      shadowOffset: {width: 0, height: 2},
  },
});