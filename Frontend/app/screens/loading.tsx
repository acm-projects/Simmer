
import { StyleSheet, Text, View, ScrollView,  Button, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';

import {Image} from 'expo-image';




export default function Loading(){
 
 

    return(
   
    <View style={styles.container}>
      <Image source={require('../../assets/Simmy/Thinking_Simmy.gif')} style={styles.mascot}/>
     
    </View>
     
    )};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 50,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    
  },
  
   mascot: {
      height: 400,
      width: 400,
      alignSelf: 'center',
      marginTop: 60,
  },
  
});
