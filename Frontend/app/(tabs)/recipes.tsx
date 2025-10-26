import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import LargeCard from "@/components/largeCard";
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';


export default function RecipeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.title}>Recipes</Text>
     </View>

<View style ={{marginTop: 30}}>
<Text style={styles.text}>11 Recipes</Text>

 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
 

</View>

          <StatusBar style="auto" />
        </ScrollView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 50,
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
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
    fontFamily: 'Nunito_700Bold',
  },
  text:{
    fontSize: 16,
    paddingLeft: 25,
    paddingBottom: 5,
    fontFamily: 'Nunito_400Regular'
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
  },
   arrow: {
   color: "#9BA760",
   position: "absolute",
   left: 25,
   top: -25,
 },
});
