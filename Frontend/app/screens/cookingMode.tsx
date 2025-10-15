import React, { useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold} from '@expo-google-fonts/orbitron'
import {Timer} from 'react-native-flip-timer-fixed';
import { Plus } from 'lucide-react-native';

export default function SettingScreen() {
    let [fontsLoaded] = useFonts({
        Orbitron_400Regular,
        Orbitron_700Bold // Add all desired font styles here
      });
      const [play, setPlay] = useState(true);
      const [seconds, setSeconds] = useState(120);
      

  return (
    <ScrollView style={styles.container}>
  <View style={{flexDirection: 'row', alignItems: 'center'}}>

     
     <ArrowLeft  size={20} style={{margin: 5, }}/>
     

     <View style={{backgroundColor: '#ffff', borderRadius: 100, width: '80%', marginLeft: 10, }}>
        <View style={{backgroundColor: '#262e05ff', width: '30%', borderRadius: 100,}}>
            <Text> </Text>
        </View>
     </View>
  </View>
  
  <View style={{position: 'relative', top: 400}}>
  <TouchableOpacity 
  onPress={() => setSeconds((prev) => prev + 60)} 
  style={{backgroundColor: '#262e05ff', borderRadius: 100, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10}}>
     <Plus color='white'/>
    </TouchableOpacity>

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
    paddingLeft: 15,
    padding: 10,
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
        color: "#ffffff",
    },
     title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
  customText:{
    fontFamily: 'Orbitron_400Regular',
    fontSize: 80,
  }
});
