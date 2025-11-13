import {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import LargeCard from "@/components/largeCard";
import { useSupabase } from '../../app/contexts/SupabaseContext';
import { useRecipes } from '../contexts/RecipeContext';
import { useUser } from '../contexts/UserContext'
import { useFavoriteRecipes } from '../contexts/FavoriteRecipeContext';




export default function RecipeScreen() {
 // const {favoriteRecipes:recipes}=useFavoriteRecipes();
  const {recipes} = useRecipes();
  const count = recipes?.length ?? 0;
  const{user}=useUser();
  // console.log('yyyyyyyyyyyyyyyyyyyyyyyyyy')
  console.log(user)

  return (
    <ScrollView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.title}>Recipes</Text>
     </View>


<View style ={{marginTop: 20}}>
  <Text style={styles.text}>{count} recipes</Text>
 {recipes?.map((currentRecipe,index)=>{
      return (<LargeCard key={index} title={currentRecipe.title} image={currentRecipe.image_url} cook_time={currentRecipe.cook_time} prep_time={currentRecipe.prep_time} id={currentRecipe.id} fav={currentRecipe.user_favorites.length>0} />);
    })}
 

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
    top: 30,
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
