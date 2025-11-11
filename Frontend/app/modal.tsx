import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import LargeCard from '@/components/largeCard';
import { useRecipes } from './contexts/RecipeContext';
import LargeCardModal from '@/components/largeCardModal';
import { useSupabase } from './contexts/SupabaseContext';
import { useUser } from './contexts/UserContext'

type AddToCollectionModalProps = {
  open: boolean;
  onClose: () => void;
  collectionId:string;
  setCollectionRecipe:Dispatch<SetStateAction<any[] | undefined>>;
  recipeIds:string[]|undefined;
};

export default function AddToCollectionModal({ open, onClose, collectionId, setCollectionRecipe, recipeIds }: AddToCollectionModalProps) {
  const {recipes:recipesData}= useRecipes();
  const [recipes,setRecipes] = useState(recipesData? recipesData?.map((recipe)=>({title:recipe.title,image:recipe.image_url,id:recipe.id})):[])
  useEffect(()=>{
    if(!recipeIds)
      return
    setRecipes((recipes).filter((recipe)=>!recipeIds.includes(recipe.id)))
  },[])
  const supabase=useSupabase();
  const addRecipeToCollection= async(id:string)=>{
    const { data: { session }, error } = await supabase.auth.getSession();
    if(!session)
      return
    if(!recipesData)
      return
    try{
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}user/collections/add-recipe`, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
              "collection_id" : collectionId,
              "recipe_id" : id
            

          })
      })
      const recipe=recipesData.find((recipe)=>recipe.id===id);
      console.log(recipe)
      setCollectionRecipe((currentRecipes)=>([{title:recipe.title,image:recipe.image_url,cook_time:recipe.cook_time,prep_time:recipe.prep_time,id:recipe.id},...currentRecipes||[]]))
      setRecipes((currentRecipes:any)=>currentRecipes.filter((recipe:any)=>recipe.id!==id))
    }catch(error){
      console.error('Fetch error:', error);
    }

  }
  // [
  //   { title: "Creamy Garlic Pasta", image: { uri: "https://images.unsplash.com/photo-1603133872878-684f208fb84b" } },
  //   { title: "Avocado Toast Deluxe", image: { uri: "https://images.unsplash.com/photo-1551183053-bf91a1d81141" } },
  //   { title: "Blueberry Pancakes", image: { uri: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b" } },
  //   { title: "Classic Margherita Pizza", image: { uri: "https://images.unsplash.com/photo-1601924582971-c9a7e9d2d4b3" } },
  //   { title: "Teriyaki Chicken Bowl", image: { uri: "https://images.unsplash.com/photo-1604908177522-43256d31e45a" } },
  //   { title: "Beef Tacos", image: { uri: "https://images.unsplash.com/photo-1601050690597-36e95e17fd97" } },
  //   { title: "Fresh Caesar Salad", image: { uri: "https://images.unsplash.com/photo-1603133873035-33263c3d9c3d" } },
  //   { title: "Salmon Poke Bowl", image: { uri: "https://images.unsplash.com/photo-1617196034796-73f6d5aa1f86" } },
  //   { title: "Chocolate Lava Cake", image: { uri: "https://images.unsplash.com/photo-1605470351558-330b4b88f7e5" } },
  //   { title: "Veggie Stir Fry", image: { uri: "https://images.unsplash.com/photo-1605470351558-330b4b88f7e5" } },
  // ];

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <View style={styles.modalOverlay}>
        {/* Bottom sheet */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.bottomSheet}>
            <Text style={styles.title}>Recipes</Text>

            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}>
              {recipes.map((recipe, index) => (
                <TouchableOpacity key={index} onPress={()=>addRecipeToCollection(recipe.id)}>
                    <LargeCardModal key={index} title={recipe.title} image={recipe.image} />
                </TouchableOpacity>
                
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)', 
   // dim background
  },
  
  bottomSheet: {
    backgroundColor: '#f5ebe6ff',
    paddingTop: 20,
    paddingHorizontal: 15,
   borderRadius: 15,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Android shadow
  },
  title: {
    fontSize: 25,
    color: '#9BA760',
    fontFamily: 'Nunito_700Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#9BA760',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
