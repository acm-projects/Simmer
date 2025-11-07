import React, {useState} from 'react';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import AddToCollectionModal from '../../modal';

import LargeCard from "@/components/largeCard";


export default function RecipeScreen() {
  const {id} = useLocalSearchParams<any>();
  const router = useRouter(); // 👈 for navigation control
  const[openAdd, setOpenAdd] = useState(false);
  return (
    <ScrollView style={styles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View></View>
      <TouchableOpacity onPress={() => router.back()} style={styles.arrowContainer}>
        <ArrowLeft size={24} color="#9BA760" />
      </TouchableOpacity>

      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10, width: '100%' }}>
        <Text style={styles.title}>Favorites</Text>
      </View>


    </View>

      <View style={{ marginTop: 30 }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <Text style={styles.text}>11 Recipes</Text>
        
      <TouchableOpacity style={styles.icons} onPress={() => setOpenAdd(true)}>
      
        <Plus color={'white'} size={18}/>  
      </TouchableOpacity>

      <AddToCollectionModal collectionId={id}open={openAdd} onClose={() => setOpenAdd(false)} />
      </View>

        {/* <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} /> */}
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
