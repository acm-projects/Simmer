import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import { Heart } from 'lucide-react-native';


const CornerIcon = () => {
  return (
      <View style={styles.container}>
        <Heart size={22} color="white"/>
      </View>
   
  )
}

const styles = StyleSheet.create({
container:{
    backgroundColor: '#2E321E',
    borderRadius: 100,
    padding: 4,
    margin: 2,
    height: 34,
    width: 34,
    justifyContent: 'center',
    alignItems: 'center'
},


});


export default CornerIcon

