import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, Button, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform} from 'react-native';
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
  const [step, setStep] = useState(['']);
  const[isVisible, setIsVisible] = useState(false);
  const [ingredient, setIngredient] = useState([{name: '', quantity: '', unit: ''}]);
  const [userToken, setUserToken] = useState("YOUR_JWT_TOKEN_HERE");
  

 const updateIngredient = (index: number, field: "quantity" | "unit" | "name", value: string) => {
  const updated = [...ingredient];
  updated[index] = { ...updated[index], [field]: value };
  setIngredient(updated);
};

    const addIngredient = () => {
    setIngredient([...ingredient, { name: '', quantity: '', unit: '' }]);
  };

  // --- Step handlers ---
  const updateStep = (index: number, value: string) => {
    const updated = [...step];
    updated[index] = value;
    setStep(updated);
  };

  const addStep = () => {
    setStep([...step, '']);
  };

 const handleCreateRecipe = async () => {
  // Create recipe data object from state
  const recipeData = {
    title: title,
    instructions: step,
    prep_time: parseInt(prepMin) || 0,
    cook_time: parseInt(cookMin) || 0,
    dietary_tags: [],
    ingredients: ingredient,
  };

  try {
    const response =  await fetch(`${process.env.EXPO_PUBLIC_API_URL}create_recipe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userToken}`
      },
      body: JSON.stringify(recipeData)
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Recipe created successfully! ID: ${data.recipe_id}`);
      setTitle('');
      setPrepMin('');
      setCookMin('');
      setIngredient([{ name: '', quantity: '', unit: '' }]);
      setStep(['']);
    } else {
      alert(`Error: ${data.error || 'Failed to create recipe'}`);
    }
  } catch (err) {
    console.error("Error creating recipe:", err);
    alert("Could not connect to server");
  }
};
  
 

    return(
   
    <View style={styles.container}>
      <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS === "ios" ? "padding": undefined}
      keyboardVerticalOffset={0}
      >
        <ScrollView>
     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
         <Text style={styles.title}>Recipes</Text>
         </View>
    
    
        <TouchableOpacity onPress={() => router.back()}>
         <ArrowLeft size={20} style={styles.arrow}/>
         </TouchableOpacity>
            
            <View style={{position: 'relative' , top: 20}}>
            <View style={styles.greenBox}>
                <TouchableOpacity style={{padding: 5}}
                onPress={() => setIsVisible(true)}>
                  <Text style={styles.text}>Import</Text>
                </TouchableOpacity>
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
              <Plus size={40} color={'#9BA760'}/>
              </View>
                <View style={styles.titleBox}>
                    <TextInput 
                    style={styles.title2}
                    placeholder="Title"
                    value={title}
                    onChangeText={setTitle}
                    />
                    <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.time}>Prep: </Text>
                    <TextInput
                      style={[styles.time, ]}
                      placeholder="__"
                      placeholderTextColor="#e0e0e0ff"
                      value={prepMin}
                      onChangeText={setPrepMin}
                    />
                    <Text style={styles.time}> min</Text>
                  </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.time}>Cook: </Text>
                    <TextInput
                      style={[styles.time, ]}
                      placeholder="__"
                      placeholderTextColor="#e0e0e0ff"
                      value={cookMin}
                      onChangeText={setCookMin}
                    />
                    <Text style={styles.time}> min</Text>
                  </View>
                    </View>
                
                </View>
            </View>
            </View>

        <View style={styles.desBox}>
        <Text style={styles.title1}>Ingredients</Text>
        {ingredient.map((ing, index) => (
          <View
            key={index}
            style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}
          >
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <TextInput
              style={[styles.recipe, { paddingLeft: 2 }]}
              placeholder="#"
              placeholderTextColor="#a1a1a1ff"
              value={ing.quantity}
              onChangeText={(text) => updateIngredient(index, "quantity", text)}
            />
            <TextInput
              style={[styles.recipe, { paddingLeft: 2 }]}
              placeholder="unit"
              placeholderTextColor="#a1a1a1ff"
              value={ing.unit}
              onChangeText={(text) => updateIngredient(index, "unit", text)}
            />
            <TextInput
              style={[styles.recipe, { paddingLeft: 2 }]}
              placeholder="ingredient"
              placeholderTextColor="#a1a1a1ff"
              value={ing.name}
              onChangeText={(text) => updateIngredient(index, "name", text)}
            />
          </View>
        ))}
        <TouchableOpacity onPress={addIngredient} style={[styles.smallGreenBox, { width: 120 }]}>
          <Text style={styles.time}>Add Ingredient</Text>
        </TouchableOpacity>
      </View>
             
                         <View style={styles.desBox}>
        <Text style={styles.title1}>Steps</Text>
        {step.map((stepText, index) => (
          <View
            key={index}
            style={{ flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 20 }}
          >
            <Text style={styles.bullet}>{index + 1}.</Text>
            <TextInput
              style={[styles.recipe, { paddingLeft: 2, flex: 1 }]}
              placeholder="Step"
              placeholderTextColor="#a1a1a1ff"
              value={stepText}
              onChangeText={(text) => updateStep(index, text)}
            />
          </View>
        ))}
        <TouchableOpacity onPress={addStep} style={[styles.smallGreenBox, { width: 100 }]}>
          <Text style={styles.time}>Add Step</Text>
        </TouchableOpacity>
      </View>
                     <View style={{alignItems: 'center', marginTop: 20}}>
                      <TouchableOpacity
                      style={[styles.greenBox, {width: 180}]}
                      onPress={handleCreateRecipe}>
                        <Text style={styles.text}>Done</Text>
                      </TouchableOpacity>
                     </View>
                     </ScrollView>
                    </KeyboardAvoidingView> 
        </View>
     
    )}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 70,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    
  },
  content:{
    padding: 1,
    top: 1,
  },
    text:{
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Nunito_400Regular',

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
    fontFamily: 'Nunito_700Bold',
  },
  greenBox:{
    borderRadius: 100,
    marginHorizontal: 15,
    backgroundColor: '#9BA760',
    padding: 2,
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
    fontFamily: 'Nunito_700Bold',
  },
     title2:{
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
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
