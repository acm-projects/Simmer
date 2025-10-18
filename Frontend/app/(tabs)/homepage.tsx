import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import SmallCard from "@/components/smallCard";
import LargeCard from "@/components/largeCard";
import CornerIcon from "@/components/cornerIcon";
import { Link } from 'expo-router';
import MyCarousel from "@/components/carousel";


export default function HomeScreen() {
  return (

   <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <View style={styles.row}>
      <Text style={styles.title}>Hi! Dianne </Text>
      <View style={styles.icons}>

        <CornerIcon />  
      </View>
      
    </View>
    
    <Text style={styles.text}>What are you cooking today?</Text>

      
<Text style={styles.subtitle}>Favorites</Text>
      <View style={styles.greenBox}>
        
        
        <View style={styles.grid}>
          <MyCarousel />
        
        </View>
       
  
      </View>

      <LargeCard/>

      <LargeCard/>

      <LargeCard/>
      <LargeCard/>
      <LargeCard/>


  

          <StatusBar style="auto" />
          
         </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
   
  },
  content:{
    top: 50,
  },
  gridItem: {
    flex: 1, // Ensures items take equal space in a row
    alignItems: 'center',
  },
  grid:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
    
  },
  title:{
    fontSize: 40,
    paddingLeft: 15,
    paddingTop: 15,
    color: '#262e05ff',
  },
  text:{
    fontSize: 15,
    paddingLeft: 15,
    color: 'black',
  
  },
  subtitle:{
    fontSize: 25,
    paddingLeft: 30,
    paddingTop: 15,
    color: 'black',
    alignSelf:'flex-start',
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
  greenBox:{
    backgroundColor: '#9BA760', 
    borderRadius: 0, 
    paddingBottom: 15,
    paddingTop: 10,
  
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 5,
    paddingHorizontal: 20,

  }
});
