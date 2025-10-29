import React from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import LargeCard from '@/components/largeCard';

type AddToCollectionModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddToCollectionModal({ open, onClose }: AddToCollectionModalProps) {
  const recipes = [
    { title: "Creamy Garlic Pasta", image: { uri: "https://images.unsplash.com/photo-1603133872878-684f208fb84b" } },
    { title: "Avocado Toast Deluxe", image: { uri: "https://images.unsplash.com/photo-1551183053-bf91a1d81141" } },
    { title: "Blueberry Pancakes", image: { uri: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b" } },
    { title: "Classic Margherita Pizza", image: { uri: "https://images.unsplash.com/photo-1601924582971-c9a7e9d2d4b3" } },
    { title: "Teriyaki Chicken Bowl", image: { uri: "https://images.unsplash.com/photo-1604908177522-43256d31e45a" } },
    { title: "Beef Tacos", image: { uri: "https://images.unsplash.com/photo-1601050690597-36e95e17fd97" } },
    { title: "Fresh Caesar Salad", image: { uri: "https://images.unsplash.com/photo-1603133873035-33263c3d9c3d" } },
    { title: "Salmon Poke Bowl", image: { uri: "https://images.unsplash.com/photo-1617196034796-73f6d5aa1f86" } },
    { title: "Chocolate Lava Cake", image: { uri: "https://images.unsplash.com/photo-1605470351558-330b4b88f7e5" } },
    { title: "Veggie Stir Fry", image: { uri: "https://images.unsplash.com/photo-1605470351558-330b4b88f7e5" } },
  ];

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
                <TouchableOpacity>
                    <LargeCard key={index} title={recipe.title} image={recipe.image} />
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
