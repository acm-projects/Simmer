import react, {useEffect, useState} from 'react'
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity} from 'react-native';
import { router, Link } from 'expo-router';


import CollectionCard from "@/components/collectionCard";
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useSupabase } from '../contexts/SupabaseContext';
import { useCollection } from '../contexts/CollectionContext';
import { getCollections } from '../utils/recipe';






export default function FavoritesScreen() {
  const {collections:collectionResult, setCollections:setCOllectionsResult}=useCollection();
  const[collections, setCollections]= useState<any[]|undefined>([]);
  const[addCollection, setAddCollection] = useState('');
  const supabase = useSupabase();
  const[modalVisible, setModalVisible] = useState(false);
  useEffect(()=>{
    if(collectionResult)
      setCollections(collectionResult);
  },[collectionResult])

  const handleAddCollection = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if(!session)
      return
    if (addCollection.trim() === '') return; // avoid empty names
    // setCollections(prev => [...prev, addCollection]);
    await getCollections(session.access_token,setCOllectionsResult)
    setAddCollection(''); // clear input after adding
  };

  const postCollection= async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if(!session)
      return
    setModalVisible(false);
    try{
      await fetch(`${process.env.EXPO_PUBLIC_API_URL}user/collections/create`, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
              "title" : addCollection,
              "description" : addCollection
            

          })
      })
      await handleAddCollection()
    }catch(error){
      console.error('Fetch error:', error);
    }
  }


 return (
  <View style={styles.container}>
        <KeyboardAvoidingView 
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding": undefined}
            keyboardVerticalOffset={0}
            >
      <ScrollView>
     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.text}>Collections</Text>
     </View>



     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
      {collections.map((collection, index) => (
        <Link href={{
          pathname: `../screens/recipeCollection/${collection.id}`,
          params: {}}} style={{padding: 10}} key={index} >
          <CollectionCard key={index} title={collection.title ?? 'Untitled'}/>
          </Link>
      ))}
       
     </View>

     <View style={{flexDirection: 'row', alignItems: 'center', width: '45%', alignSelf: 'center'}}>
      <TouchableOpacity 
        style={[styles.greenBox, {width: '90%', marginTop: 10}]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textAdd}>+ New Collection</Text>
      </TouchableOpacity>
    </View>


    </ScrollView>

    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Collection</Text>
          
          <TextInput 
            style={styles.modalInput}
            placeholder='Collection name'
            placeholderTextColor="#999"
            value={addCollection}
            onChangeText={setAddCollection}
            autoFocus={true}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setModalVisible(false);
                setAddCollection('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalButton, styles.addButton]}
              onPress={postCollection}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    </KeyboardAvoidingView>
  </View>
 );
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#f5ebe6ff',
   paddingTop: 65,
 },
 text: {
   fontSize: 25,
   color: '#9BA760',
   fontFamily: 'Nunito_700Bold',
   marginBottom: 10,
 },
  textAdd: {
   fontSize: 15,
   color: '#fff',
   fontFamily: 'Nunito_700Bold',
 },
 bubble: {
   backgroundColor: '#9BA760',
   padding: 12,
   borderRadius: 16,
   maxWidth: "80%",
   marginVertical: 10,
   alignSelf: "center",
 },
 bubbleText: {
   fontSize: 16,
   color: "white",
   textAlign: "center",
   fontFamily: 'Nunito_400Regular',
 },
 arrow: {
   color: "#9BA760",
   position: "absolute",
   left: 25,
   top: -25,
 },
   greenBox:{
    backgroundColor: '#9BA760',
    paddingLeft: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100,
    height: 42,
    alignContent: 'center',
    justifyContent: 'center',
  },
    plus:{
    backgroundColor: '#262e05ff', 
    borderRadius: 100,  
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: '#9BA760',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#9BA760',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  addButton: {
    backgroundColor: '#9BA760',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#666',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#fff',
  },
});