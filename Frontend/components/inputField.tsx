import { Alert, Button, TextInput, Text , StyleSheet, View, TextInputProps} from 'react-native';
import React, { ReactNode } from 'react';
type InputFieldProps = {
  label: string;
  children?: ReactNode;
} & TextInputProps;
export function InputField({ label, value, onChangeText, placeholder, secureTextEntry, children }:InputFieldProps){
  return(
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
        <TextInput style={styles.input}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor='#fffbfbff'
          secureTextEntry={secureTextEntry}
          value={value}
        />
        {children}
    </View>)
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom:0,
    flex:1

  },
  label:{
    margin:10

  },
  input:{
    backgroundColor: '#9BA760',
    borderRadius: 20,
    paddingHorizontal: 20,
    width:350,
    height: 50,
    color:'#FFFFFF',
  }

});