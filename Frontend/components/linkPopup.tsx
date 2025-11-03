import React, {Dispatch, SetStateAction} from 'react'
import { StyleSheet, Text, View, Image, TextInput } from 'react-native';

interface LinkPopupProps {
  link: string | undefined;
  setLink: Dispatch<SetStateAction<string | undefined>>;
}

const LinkPopup = ({link, setLink}: LinkPopupProps) => {

  return (
    <View style={styles.container}>
        <Text style={styles.text}>Recipe Link:</Text>
        <View style={styles.textBox}>
        <TextInput 
        style={styles.text}
        placeholder="Link"
        placeholderTextColor={'#abb08cff'}
        value={link}
        onChangeText={setLink}
        />
        </View>
        
    </View>

  )}

  export default LinkPopup

  const styles = StyleSheet.create({
    container:{
        backgroundColor: '#fff',


    },
    textBox:{
        backgroundColor: '#d7d3d3ff',
        borderColor: '#9BA760',
        borderWidth: 1,
        borderRadius: 2,
        paddingLeft: 10,
        marginTop: 5,
        width: 200,
    },
    text:{
        fontSize: 20,
        color: '#9BA760',
        fontFamily: 'Nunito_400Regular',
    }

  })
