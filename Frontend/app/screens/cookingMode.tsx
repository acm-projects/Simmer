import React, { useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold} from '@expo-google-fonts/orbitron'
import {Timer} from 'react-native-flip-timer-fixed';
import { Plus, Minus, Play, Pause } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingScreen() {
    let [fontsLoaded] = useFonts({
        Orbitron_400Regular,
        Orbitron_700Bold // Add all desired font styles here
      });
      const [play, setPlay] = useState(true);
      const [seconds, setSeconds] = useState(120);
      const [isVisible, setVisible] = useState(false);
      

  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft  size={20} style={styles.arrow}/>
        </TouchableOpacity>
        
        <View style={{backgroundColor: '#ffff', borderRadius: 100, width: '80%', marginLeft: 10, }}>
          <View style={{backgroundColor: '#262e05ff', width: '30%', borderRadius: 100,}}>
            <Text> </Text>
          </View>
        </View>
      </View>
  
      <View style={{ marginTop: 20}}>
        <Image source={require('../../assets/images/Simmer_Mascot.png')} style={styles.mascot}/>
        <View style={{flexDirection: 'row', width: '100%' }}>
        {isVisible && (
          <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev + 60)} 
          style={[styles.timerButton,{ position: 'relative', left: '46%' }]}>
          <Plus color='white'/>
        </TouchableOpacity> )}
          {isVisible && (
          <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev + 3600)} 
          style={[styles.timerButton, {position: 'relative', left: 11}]}>
          <Plus color='white'/>
        </TouchableOpacity> )}
      

          {isVisible && (  <TouchableOpacity 
          style={[styles.editButton, {position: 'relative', left: '66%'}]}
          onPress={() => {setVisible(false); setPlay(true)}}>
        <Text style={styles.text}>Done</Text>
          </TouchableOpacity>)}

        </View>
<View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 4}}>
      {!play && !isVisible && (  <TouchableOpacity
        style={styles.timerButton}
        onPress={() => setPlay(true)}>
          <Play color={'white'} size={18}/>
        </TouchableOpacity>)}
        {play && !isVisible && (
         <TouchableOpacity
        style={styles.timerButton}
        onPress={() => setPlay(false)}>
          <Pause color={'white'} size={18}/>
        </TouchableOpacity>)}
          {!isVisible && (  <TouchableOpacity 
          style={[styles.editButton,]}
          onPress={() => {setVisible(true);setPlay(false);}}>
        <Text style={styles.text}>Edit</Text>
          </TouchableOpacity>)}
          </View>
    
       

        <Timer
          time={seconds}
          play={play}
          wrapperStyle={{ 
            flexDirection: 'row', 
            backgroundColor: 'transparent',
          }}
          showCircles={true}
          flipNumberProps={{
            numberStyle: { color: '#ffffff', fontSize: 36 },
            flipCardStyle: {backgroundColor: '#262e05ff', },
            cardStyle: {backgroundColor: '#262e05ff', borderRadius: 0}
          }}
        />
      <View style={{flexDirection: 'row'}}>
         {isVisible && ( <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev - 60)} 
          style={[styles.timerButton, { position: 'relative', left: '46%' }]}>
          <Minus color='white'/>
        </TouchableOpacity>)}

        
          {isVisible && (
          <TouchableOpacity 
          onPress={() => setSeconds((prev) => prev - 3600)} 
          style={[styles.timerButton, {position: 'relative', left: 11}]}>
          <Minus color='white'/>
        </TouchableOpacity>)}

         </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#9BA760',
    paddingTop: 70,
    paddingLeft: 15,
    paddingRight: 15,
    
  },
  content:{
    padding: 1,
    top: 1,
  },
    text:{
    fontSize: 18,
    color: 'white',
    fontFamily: 'Nunito_400Regular',
  },
    info:{
    fontSize: 18,
    paddingLeft: 25,
    padding: 10,
  },
     delete:{
    fontSize: 15,
    paddingLeft: 15,
    padding: 8,
    color: 'red'
  },
    arrow: {
        color: "#fff",
        margin: 5,
    },
     title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
  mascot: {
      height: 400,
      width: 400,
  },
  timerButton:{
    backgroundColor: '#262e05ff', 
    borderRadius: 100, 
    width: 30, 
    height: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10, 
    marginTop: 10
  },
  editButton:{
    backgroundColor: '#262e05ff', 
    borderRadius: 100, 
    width: 60, 
    height: 30,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10, 
    marginTop: 10
  }
});