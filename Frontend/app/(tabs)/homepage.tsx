import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import SmallCard from "@/components/smallCard";
import LargeCard from "@/components/largeCard";
import CornerIcon from "@/components/cornerIcon";
import { Link } from 'expo-router';
import MyCarousel from "@/components/carousel";
import { useRecipes } from '../contexts/RecipeContext';

export default function HomeScreen() {
  const {recipes}=useRecipes();
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
        
        
      <MyCarousel />
        
       
  
    </View>
    {recipes?.map((currentRecipe,index)=>{
      return (<LargeCard key={index} title={currentRecipe.title} image={currentRecipe.image_url} cook_time={currentRecipe.cook_time} prep_time={currentRecipe.prep_time} id={currentRecipe.id} />);
    })}
  
    {/* <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} /> */}

  
     

    




  

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
    top: 30,
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
    fontFamily: 'Nunito_700Bold',
  },
  text:{
    fontSize: 15,
    paddingLeft: 15,
    color: 'black',
    fontFamily: 'Nunito_400Regular',
  
  },
  subtitle:{
    fontSize: 25,
    paddingLeft: 30,
    paddingTop: 15,
    color: '#262e05ff',
    alignSelf:'flex-start',
    fontFamily: 'Nunito_600SemiBold',
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
    paddingBottom: 1,
    paddingTop: 1,
  
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 5,
    paddingHorizontal: 20,

  }
});
