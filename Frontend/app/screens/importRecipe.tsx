import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, Button, TextInput, Modal, TouchableOpacity} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold} from '@expo-google-fonts/orbitron'
import TabLayout from '../(tabs)/_layout';
import { Plus } from 'lucide-react-native';
import LinkPopup from '@/components/linkPopup'
import { router } from 'expo-router';


export default function ImportRecipe(){

  const [title, setTitle] = useState('');
  const [prepMin, setPrepMin] = useState('');
  const [cookMin, setCookMin] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [step, setStep] = useState('');
  const [amount, setAmount] = useState('');

  const[isVisible, setIsVisible] = useState(false);

    return(
        <ScrollView style={styles.container}>
     
     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
         <Text style={styles.title}>Recipes</Text>
         </View>
    
    
        <TouchableOpacity onPress={() => router.back()}>
         <ArrowLeft size={20} style={styles.arrow}/>
         </TouchableOpacity>
            
            <View style={{position: 'relative' , top: 20}}>
            <View style={styles.greenBox}>
                <Button title="Import" color='#fff' onPress={() => setIsVisible(true)}/>
                  <Modal
                  visible={isVisible}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setIsVisible(false)}
                  >
                  <View style={styles.overlay}>
                    <View style={styles.popup}>
                      <LinkPopup/>
                      <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsVisible(false)}>
                    <Text style={styles.text}>OK</Text>
                  </TouchableOpacity>
                    </View>
                  </View>
                  
                  </Modal>
            </View>
             </View>
             

             <View>
                         <View style={styles.card}>
                            <View style={styles.image}>
                            <Plus size={40} style={{color: '#9BA760'}}/>
                            </View>
                             <View style={styles.titleBox}>
                                 <TextInput 
                                 style={styles.title2}
                                 placeholder="Title"
                                 value={title}
                                 onChangeText={setTitle}
                                 />
                                 <View>
                                     <Text style={styles.time}>Prep:  
                                  <TextInput 
                                 style={styles.time}
                                 placeholder="__"
                                 value={prepMin}
                                 onChangeText={setPrepMin}
                                 />min</Text>

                                      <Text style={styles.time}>Cook:  
                                  <TextInput 
                                 style={styles.time}
                                 placeholder="__"
                                 value={cookMin}
                                 onChangeText={setCookMin}
                                 />min</Text>
                                 </View>
                             
                             </View>
                         </View>
             
                         <View style={styles.desBox}>
                             <Text style={styles.title1}>Ingredients</Text>
                               <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 20}}>
                                <Text style={styles.bullet}>{'\u2022'}</Text>
                                  <TextInput 
                                 style={[styles.recipe,{paddingLeft: 2, paddingRight: 2,}]}
                                 placeholder="__ "
                                 value={amount}
                                 onChangeText={setAmount}
                                 />
                                   <TextInput 
                                 style={[styles.recipe,{paddingLeft: 2}]}
                                 placeholder="ingredient"
                                 value={ingredient}
                                 onChangeText={setIngredient}
                                 />
                              
                              </View>

                              
                             <View style={[styles.smallGreenBox,{width: 120}]}>
                              <Text style={styles.time}>Add Ingredient</Text></View> 
                         </View>
             
                          <View style={styles.desBox}>
                             <Text style={styles.title1}>Steps</Text>
                             <View style={{flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 20}}>
                                <Text style={styles.bullet}>1.</Text>
                                 <TextInput 
                                 style={[styles.recipe,{paddingLeft: 2}]}
                                 placeholder="steps"
                                 value={step}
                                 onChangeText={setStep}
                                 />
                              </View>
                            
                                 <View style={styles.smallGreenBox}>
                              <Text style={styles.time}>Add Step</Text></View> 
                            
                              
                         </View>
                     </View>
        </ScrollView>
    )}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 70,
    paddingLeft: 15,
    paddingRight: 15,
    
  },
  content:{
    padding: 1,
    top: 1,
  },
    text:{
    fontSize: 18,
    color: '#fff',

  },
    recipe:{
    fontSize: 16,
    color: '#000',
    paddingTop: 4,

  },
    time:{
    fontSize: 15,
    color: '#fff',

  },
    info:{
    fontSize: 18,
    paddingLeft: 25,
    padding: 10,
  },
     delete:{
    fontSize: 15,
    paddingLeft: 15,
    padding: 8,
    color: 'red'
  },
    arrow: {
   color: "#9BA760",
   position: "absolute",
   left: 25,
   top: -25,
 },
     title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
  customText:{
    fontFamily: 'Orbitron_400Regular',
    fontSize: 80,
  },
  greenBox:{
    borderRadius: 100,
    marginHorizontal: 15,
    backgroundColor: '#9BA760',
    padding: 0,
    alignItems: 'center',
    margin: 5,

  },
  smallGreenBox:{
    borderRadius: 100,
    backgroundColor: '#9BA760',
    padding: 2,
    alignItems: 'center',
    margin: 2,
    marginHorizontal: 15,
    marginTop: 10,
    width: 100,
    

  },
  closeButton:{
    borderRadius: 100,
    backgroundColor: '#9BA760',
    padding: 2,
    alignItems: 'center',
    margin: 2,
    marginHorizontal: 15,
    marginTop: 10,
    width: 100,
    

  },
    title1:{
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 25,
    color: '#9BA760',
  },
     title2:{
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 30,
    color: '#fff',
  },
  titleBox:{
    backgroundColor: '#9BA760',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingBottom: 10,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,

  },
  desBox:{
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 12,
    paddingTop: 5,
    paddingBottom: 15,
    marginHorizontal: 5,

  },
  card:{
    marginVertical: 2,
    borderRadius: 12,
    padding: 5,
    marginTop: 30,
  },
   bullet: {
    fontSize: 16, // Adjust size as needed
    marginRight: 8,
  },
  image:{
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    height: 225,
    width: "100%",
    borderWidth: 2,
    borderColor: '#9BA760',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dark transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
  },
  
});
