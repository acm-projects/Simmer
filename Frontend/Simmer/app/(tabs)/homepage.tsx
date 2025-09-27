import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import SmallCard from "@/components/smallCard";
import LargeCard from "@/components/largeCard";
import CornerIcon from "@/components/cornerIcon";
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (

   <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <View style={styles.row}>
      <Text style={styles.title}>Hi! Dianne </Text>
      <View style={styles.icons}>
        <CornerIcon icon="add"/>
        <CornerIcon icon ="search-outline"/>
        <CornerIcon icon ="menu-outline"/>
      </View>
      
    </View>
    
    <Text style={styles.text}>What are you cooking today?</Text>
  
    <View style={styles.container}>
      <Text style={styles.subtitle}>Recipe Suggestions</Text>
      <LargeCard/>
      <View style={{margin: 20}}>
      <View style={{backgroundColor: '#9BA760', borderRadius: 30, paddingBottom: 10, paddingLeft: 10, paddingRight: 10,}}>
        <Text style={[styles.subtitle, {color: '#fff' }]}>Your Recipes</Text>
        <View style={styles.grid}>
                <View style={styles.gridItem}>
          <SmallCard/>
        </View>
        
         <View style={styles.gridItem}>
          <SmallCard/>
        </View>
        </View>
  
      </View>

   <View style={styles.grid}>
        <View style={styles.gridItem}>
          <SmallCard/>
        </View>
        
         <View style={styles.gridItem}>
          <SmallCard/>
        </View>
      </View>
      </View>



          <StatusBar style="auto" />
          
        </View>
         </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFD9C6',
  },
  content:{
    padding: 1,
    top: 50,
  },
  gridItem: {
    flex: 1, // Ensures items take equal space in a row

    justifyContent: 'center',
    alignItems: 'center',
  },
  grid:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
  title:{
    fontSize: 40,
    paddingLeft: 15,
    paddingTop: 15,
    color: '#2E321E',
  },
  text:{
    fontSize: 15,
    paddingLeft: 15,
  },
  subtitle:{
    fontSize: 20,
    color: '#2E321E',
    paddingLeft: 15,
    paddingTop: 15,
  },  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes left/right
    width: '100%', // make sure it spans full width
  },
  icons: {
    flexDirection: 'row',
    margin: 5,
    marginRight: 8,
    marginTop: 15,
  }
});
