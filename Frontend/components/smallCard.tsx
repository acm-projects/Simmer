import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FavoriteIcon from '@/components/favoriteIcon';

const SmallCard = () => {

    const hardcodedHref = '/description'; 

  return (
    <Link 
      href={hardcodedHref} 
      style={styles.linkWrapper}
      asChild>
        
      <TouchableOpacity style={styles.container} activeOpacity={0.7}>
        
        <View style={styles.imageCard}>
          <Image source={require('../assets/images/tacos.jpg')} style={styles.image}/> 
          <View style={styles.icon}>
            <FavoriteIcon icon="heart-outline" />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}> Chicken Tacos</Text> 
          <View style={[styles.text, styles.row]}>
              <Text style={styles.left} >Spicy</Text>
              <Ionicons name="alarm-outline" size ={18} color="#000" style={{marginRight: -15}}/>
              <Text style={styles.right} >15 min</Text>
          </View>
        </View>
        
      </TouchableOpacity>
    </Link>
  )
}

const styles = StyleSheet.create({
  linkWrapper: {},
  container: {
    alignItems: 'center',
    margin: 10,
  },
  image:{
    backgroundColor: 'white',
    width: 150,
    height: 150,
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
    width: 147,
    height: 65,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  title:{
      fontSize: 16,
      color: '#06402B',
      paddingTop: 12,
      marginLeft: 3,
  },
  text: {
    marginTop: 1,
    fontSize: 12,
    color: '#333',
    padding: 4,
  },

    row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes left/right
    width: '100%', // make sure it spans full width
  },
  left: {
    textAlign: 'left',
    marginLeft: 5,
  },
  right: {
    textAlign: 'right',
    marginRight: 5,
  },
  icon:{
    position: 'absolute',
    top: 10,
    right: 5,
    zIndex: 2
  },
});



export default SmallCard
