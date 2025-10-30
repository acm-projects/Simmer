import React, {useState} from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { Link } from 'expo-router';
import WavyBox from '@/components/wavyCollectionsBox'
import * as ImagePicker from 'expo-image-picker';

type CollectionCardProps ={
  title: string
};

const CollectionCard = ({title}: CollectionCardProps) => {
   const [selectedImage, setSelectedImage]= useState<string | undefined>(
      undefined
    );
    const [imageRead, setImageRead] =useState(false);
  
  
    const pickImageAsync = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
      });
  
      if(!result.canceled){
        setSelectedImage(result.assets[0].uri);
        setImageRead(true);
        console.log(result);
      }else{
        alert("You did not select any image.");
      }
    };

  return (

    <View style={styles.container}>
       
      <View style={styles.imageCard}>
           {!imageRead && (
              <TouchableOpacity 
              style={[styles.image, {borderWidth: 2, borderColor: "#9BA760"}]}
              onPress={pickImageAsync}
            
              >
                <Plus size={24} color={'#9BA760'}/>
              <Text style={styles.text}> Add Photo</Text>
              </TouchableOpacity>)}
              {imageRead && (
                <Image source={{uri: selectedImage}}
                style={styles.image}/>
              )}
      </View>
      <View style={styles.card}>
        <WavyBox/>
        <View style={styles.row}>
               <Text style={styles.title}>{title}</Text> 
        </View>
        
     
       </View>
    </View>
  
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    shadowColor: "#fff",
    shadowOffset:{width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderRadius: 15,
  },
  image:{
    backgroundColor: 'white',
    width: 350,
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',

  
  },
  imageCard:{
  
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 4,
    alignItems: 'center',
  },
  card: {
    height: 39,
    width: 350,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1,
    bottom: 7,
  },
  title:{
    textAlign: 'center',
    fontSize: 20,
      color: '#06402B',
      paddingTop: 15,
      fontFamily: 'Nunito_600SemiBold',
  },
  text: {
    marginTop: 1,
    fontSize: 15,
    color: '#333',
    padding: 1,
  },

    row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%', // make sure it spans full width
  },
  left: {
    textAlign: 'left',
    marginLeft: 9,
  },
  right: {
    textAlign: 'right',
    marginRight: 5,
  },
});



export default CollectionCard

