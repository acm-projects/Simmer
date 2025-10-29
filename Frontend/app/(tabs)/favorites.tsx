import react, {useState} from 'react'
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Touchable, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import { router, Link } from 'expo-router';


import CollectionCard from "@/components/collectionCard";
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';






export default function FavoritesScreen() {
  const[collections, setCollections]= useState(['Favorites', 'Midnight Snacks']);
  const[addCollection, setAddCollection] = useState('');

  const handleAddCollection = () => {
  if (addCollection.trim() === '') return; // avoid empty names
  setCollections(prev => [...prev, addCollection]);
  setAddCollection(''); // clear input after adding
};


 return (
  <View style={styles.container}>
        <KeyboardAvoidingView 
            style={{flex: 1}}
            behavior={Platform.OS === "ios" ? "padding": undefined}
            keyboardVerticalOffset={0}
            >
      <ScrollView>
     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.text}>Favorites</Text>
     </View>


     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
      {collections.map((title, index) => (
        <Link href="../screens/recipeCollection" style={{padding: 10}}>
          <CollectionCard title={collections.at(index) ?? 'Untitled'}/>
          </Link>
      ))}
       
     </View>

     <View style={{flexDirection: 'row', alignItems: 'center', width: '45%', alignSelf: 'center'}}>
  
    <View style={[styles.greenBox, {width: '90%', marginTop: 10,}]}>
        
        <TextInput 
        style={styles.textAdd}
        placeholder='+ New Collection'
        placeholderTextColor="#e0e0e0ff"
        value={addCollection}
        onChangeText={setAddCollection}
        onSubmitEditing={handleAddCollection}
        returnKeyType="done"
        ></TextInput>
      
    </View>
    </View>


    </ScrollView>
    </KeyboardAvoidingView>
  </View>
 );
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#f5ebe6ff',
   paddingTop: 45,
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
  }
});



