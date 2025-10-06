import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CollectionCard = () => {
  return (
    <View style={styles.container}>
       
      <View style={styles.imageCard}>
         <Image source={require('../assets/images/tacos.jpg')} style={styles.image}/>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
               <Text style={styles.title}> Collection Name</Text> 

            
               

        </View>
     
       </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  image:{
    backgroundColor: 'white',
    width: 350,
    height: 100,
    borderRadius: 15,
    bottom: -6,
    zIndex: 1,
  

  },
  imageCard:{
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset:{width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 4,

    elevation: 4,
    alignItems: 'center',
  },
  card: {
    height: 50,
    width: 347,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  title:{
    textAlign: 'center',
    fontSize: 20,
      color: '#06402B',
      paddingTop: 15,
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

