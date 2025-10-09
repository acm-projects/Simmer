import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const LargeCard = () => {
  return (
    <View style={styles.container}>
       
      <View style={styles.imageCard}>
         <Image source={require('../assets/images/tacos.jpg')} style={styles.image}/>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
               <Text style={styles.title}> Chicken Tacos</Text> 

                    <Ionicons name="alarm-outline" size ={20} color="#000" style={{paddingTop: 18, marginRight: -125}}/>
                    <Text style={[styles.right, styles.text, {paddingTop: 20, paddingRight: 10}]} >15 min</Text>

            
               

        </View>
     


            <Text style={[styles.left, styles.text, {fontSize: 13}]} >Delicous and flavorful tacos</Text>
    
    
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
    height: 150,
    borderRadius: 15,
    bottom: -6,
    zIndex: 1,
  

  },
  imageCard:{
    zIndex: 1,
    shadowColor: "#303030ff",
    shadowOffset:{width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 4,

    elevation: 4,
    alignItems: 'center',
  },
  card: {
    height: 70,
    width: 347,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  title:{
      fontSize: 20,
      color: '#06402B',
      paddingTop: 15,
      marginLeft: 3,
  },
  text: {
    marginTop: 1,
    fontSize: 15,
    color: '#333',
    padding: 1,
  },

    row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes left/right
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



export default LargeCard

