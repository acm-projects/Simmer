import {useState, ReactNode } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { ChevronDown } from 'lucide-react-native'
import { ChevronUp } from 'lucide-react-native'

interface CollapsibleSectionProps {
  title: string;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  children: ReactNode;
}

export default function CollaspisbleSection({ title, isVisible, setIsVisible, children }: CollapsibleSectionProps) {
  return (
  <View style={{ marginBottom: 10 }}>
    <TouchableOpacity
      style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", paddingHorizontal: 10 }}
      onPress={() => setIsVisible(!isVisible)}
    >
      <Text style={styles.subtitle}>{title}</Text>
      {isVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </TouchableOpacity>

    {isVisible && <View style={{ marginTop: 10 }}>{children}</View>}
  </View>
);
}


const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 70,
    paddingLeft: 15,
    paddingRight: 15,
    
  },
  content:{
    padding: 1,
    top: 1,
  },
  title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
  text:{
    fontSize: 15,
    color:'white',
    margin: 3,
    marginLeft: 1,
    marginRight: 1,
  },
  subtitle:{
    fontSize: 18,
    color: '#2E321E',
    paddingLeft: 10,
    paddingTop: 15,
  },  
 

 
});
