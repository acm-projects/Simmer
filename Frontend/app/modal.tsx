import React from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import LargeCard from '@/components/largeCard';
import { useSupabase } from '../app/contexts/SupabaseContext';
import { useRecipes } from './contexts/RecipeContext';
import { useUser } from './contexts/UserContext'


type AddToCollectionModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddToCollectionModal({ open, onClose }: AddToCollectionModalProps) {
const {recipes} = useRecipes();
const{user}=useUser();

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
              {recipes?.map((currentRecipe,index)=>{
      return (<LargeCard key={index} title={currentRecipe.title} image={currentRecipe.image_url} cook_time={currentRecipe.cook_time} prep_time={currentRecipe.prep_time} id={currentRecipe.id} />);
    })}
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
