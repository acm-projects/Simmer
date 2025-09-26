import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import SmallCard from "@/components/smallCard";
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={{margin: 20}}>
      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <SmallCard/>
        </View>
        
         <View style={styles.gridItem}>
          <SmallCard/>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9BA760',
    paddingTop: 200,
  },
    gridItem: {
    width: '48%',
    flex: 1, // Ensures items take equal space in a row

    justifyContent: 'center',
    alignItems: 'center',
  },
  grid:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
});
