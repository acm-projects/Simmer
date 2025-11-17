import React, {useState} from 'react';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import AddToCollectionModal from '../../modal';

import LargeCard from "@/components/largeCard";
import { useCollection } from '@/app/contexts/CollectionContext';


export default function RecipeScreen() {
  const {id} = useLocalSearchParams<any>();
  const router = useRouter(); // 👈 for navigation control
  const[openAdd, setOpenAdd] = useState(false);
  const {collections:collectionsData}=useCollection();
  const[collection,setCollection]=useState(collectionsData?collectionsData.find((collection:any)=>collection.id===id):[])
  const [recipes,setRecipes]=useState<any[]|undefined>(collection.collection_recipes? collection.collection_recipes.map((recipe:any)=>({title:recipe.recipes.title,image:recipe.recipes.image_url,cook_time:recipe.recipes.cook_time,prep_time:recipe.recipes.prep_time,id:recipe.recipes.id,fav:recipe.recipes.user_favorites.length>0})):[])
  const recipesIds:string[]|undefined=recipes?.map(recipe=>recipe.id)
  const count = recipes?.length ?? 0;

  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View></View>
      <TouchableOpacity onPress={() => router.back()} style={styles.arrowContainer}>
        <ArrowLeft size={24} color="#9BA760" />
      </TouchableOpacity>

      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, width: '100%' }}>
        <Text style={styles.title}>{collection.title}</Text>
      </View>


    </View>

      <View style={{ marginTop: 30 }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <Text style={styles.text}>{count} Recipes</Text>
        
      <TouchableOpacity style={styles.icons} onPress={() => setOpenAdd(true)}>
      
        <Plus color={'white'} size={18}/>  
      </TouchableOpacity>

      <AddToCollectionModal collectionId={id}open={openAdd} onClose={() => setOpenAdd(false)} setCollectionRecipe={setRecipes} recipeIds={recipesIds} />
      </View>
        {
          recipes?.map((recipe,index)=>(<LargeCard key={index} title={recipe.title} image={recipe.image} cook_time={recipe.cook_time} prep_time={recipe.prep_time} id={recipe.id} fav={recipe.fav} />))
        }

      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 60,
  },
  title: {
    fontSize: 25,
    color: '#9BA760',
    fontFamily: 'Nunito_700Bold',
  },
  text: {
    fontSize: 16,
    paddingLeft: 25,
    paddingBottom: 5,
    fontFamily: 'Nunito_400Regular',
  },
  arrowContainer: {
    position: 'absolute',
    top: 15,
    left: 25,
    zIndex: 10,
  },
  icons: {

    backgroundColor: '#9BA760',
    borderRadius: 100,
    
    margin: 7,
    marginRight: 13,
    height: 28,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center'
  },

});
