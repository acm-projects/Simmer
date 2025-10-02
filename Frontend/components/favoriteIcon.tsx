<<<<<<< HEAD:Frontend/Simmer/components/favoriteIcon.tsx
import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CornerIcon = ({icon}: {icon: keyof typeof Ionicons.glyphMap}) => {
  return (
      <View style={styles.container}>
        <Ionicons name={icon} size={22} color="white"/>
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

=======
import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const CornerIcon = ({icon}: {icon: keyof typeof Ionicons.glyphMap}) => {
  return (
      <View style={styles.container}>
        <Ionicons name={icon} size={22} color="white"/>
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
>>>>>>> recipes:Frontend/components/favoriteIcon.tsx
