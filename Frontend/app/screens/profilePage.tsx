import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, ScrollView, Button, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, } from 'react-native';
import { router } from 'expo-router'
import {ArrowLeft, Pencil, Plus} from 'lucide-react-native'
import { useRecipes } from '../contexts/RecipeContext';
import { useUser } from '../contexts/UserContext';
import {Image} from 'expo-image';
import { useSupabase } from '../contexts/SupabaseContext';

export default function ProfilePage() {
  const {user,refreshUser}=useUser();
  const[isEditing, setIsEditing] = useState(false);
   const[firstName, setFirstName] = useState(user?user.first_name:'');
   const[lastName, setLastName] = useState(user?user.last_name:'');
   const[allergens, setAllergens] =useState<string[]>([]);
   const[allAllergens, setAllAllergens] = useState(['Wheat',
  'Dairy',
  'Tree Nuts',
  'Peanuts',
  'Soy',
  'Sesame',
  'Eggs',
  'Shellfish',
  'Fish',]);
   const[newAllergen, setNewAllergen] = useState('');
   const supabase=useSupabase();
   useEffect(()=>{
      if(!user||!user.diet_restriction)
        return;
      setAllAllergens((currentDietRestrictionTags)=>{
        const dietTags=[...currentDietRestrictionTags];
        for(const diet of user.diet_restriction){
          if(!currentDietRestrictionTags.includes(diet)){
            dietTags.push(diet);         
          }
        }
        return dietTags;
      })
      setAllergens(user.diet_restriction)
      
    },[user])

   const toggleAllergen = (item: string) => {
  setAllergens((prev) =>
    prev.includes(item)
      ? prev.filter((a) => a !== item) // remove if already selected
      : [...prev, item] // add if not
  );
};
const handleEdit=async()=>{
  setIsEditing(false)
  try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error){ 
        return;
      }
      if(!session){
        return;
      }

      const response =  await fetch(`${process.env.EXPO_PUBLIC_API_URL}user/update-name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({'first_name':firstName,'last_name':lastName})
      });
       await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/dietary-restrictions`, {
          method: 'PUT', 
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
              "diet_restriction":[...allergens],

          })
      })
      const data = await response.json();
      if (response.ok) {
        await refreshUser(session.access_token)
      } else {
        alert(`Error: ${data.error || 'Failed editing user'}`);
      }
    } catch (err) {
      console.error("Error editing user:", err);
      alert("Could not connect to server");
    }
}

const handleAddAllergen = () => {
  const trimmed = newAllergen.trim();

  if (trimmed === '' || allergens.includes(trimmed)) return;

  setAllergens([...allergens, trimmed]);
  setNewAllergen('');

    if (!allAllergens.includes(trimmed)) {
    setAllAllergens([...allAllergens, trimmed]);
  }
};
    
  return (

   <View style={styles.container}>
         <KeyboardAvoidingView 
             style={{flex: 1}}
             behavior={Platform.OS === "ios" ? "padding": undefined}
             keyboardVerticalOffset={0}
             >
       <ScrollView>
      
        <View style={{ justifyContent: 'center', alignItems: 'center',}}>
            
        <Text style={styles.title}>Profile</Text>
        </View>
       
   
   
        <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={20} style={styles.arrow}/>
        </TouchableOpacity>
    
    <View style={{alignItems: 'center', paddingTop: 10, width: 150, alignSelf: 'center'}}>
         <View style={styles.icon}>
        <Pencil size={16}color={'white'}/>
         </View>
       
    <Image source={require('../../assets/images/Simmer_Mascot.png')} style={styles.mascot}/>
   
      
        </View>
<View style={{alignItems: 'center'}}>
    {!isEditing && (
    <TouchableOpacity 
    style={styles.button}
    onPress={() => setIsEditing(true)}>
        <Text style={styles.buttonText}>Edit</Text></TouchableOpacity> )}
    
    {isEditing && (
           <TouchableOpacity 
    style={styles.button}
    onPress={() => handleEdit()}>
        <Text style={styles.buttonText}>Done</Text></TouchableOpacity> )}


    <View >
    <Text style={styles.label}>First Name</Text>
    <View style={ {width:350, height: 50,}}>
    {isEditing ? (
        <TextInput 
        style={[styles.input, styles.text]}
        value={firstName}
        placeholder={firstName}
        onChangeText={setFirstName}
        />) : (
            
        <Text style={styles.text}>{firstName}</Text>
    )}
    </View>
    </View>


      <View>
    <Text style={styles.label}>Last Name</Text>
    <View style={ {width:350, height: 50,}}>
    {isEditing ? (
        <TextInput 
        style={[styles.input, styles.text]}
        value={lastName}
        placeholder={lastName}
        onChangeText={setLastName}
        />) : (
        <Text style={styles.text}>{lastName}</Text>
    )}
     </View>
    </View>


    <View>
    <Text style={styles.label}>Email</Text>
    <View style={ {width:350, height: 50,}}>
        <Text style={[styles.text]}>abc@gmail.com</Text>
    </View>
    </View>


    <View>
    <Text style={styles.label}>Allergens</Text>
    {isEditing ? ( 
        <View style={[{width:350}, styles.allergenContainer]}>
        {allAllergens.map((item) => {
            const isSelected = allergens.includes(item);
            return (
                <TouchableOpacity
                key={item}
                onPress={() => toggleAllergen(item)}
                style={[styles.nonAllergen, isSelected && styles.allergen]}>
            
            <Text style={[styles.nonAllergenText, isSelected && styles.allergenText]}>{item}</Text>
            </TouchableOpacity>
        )})}
    </View>
    ) : (
    <View style={[{width:350,}, styles.allergenContainer]}>
        {allergens.map((item, index) => (
            <View style={styles.allergen} key={index}>
            <Text key={index} style={styles.allergenText}>{item}</Text>
            </View>
        ))}
    </View> )}
    </View>
    {isEditing && (
<View style={{alignItems:'center', width: '100%'}}>
    <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 10,}}>
    <Plus color={'white'} size={22} style={styles.plus}/>
    <View style={[styles.greenBox, {height: 60,}]}>
        
        <TextInput 
        placeholder='Add Other'
        style={{margin:-1}}
        value={newAllergen}
        onChangeText={setNewAllergen}
        onSubmitEditing={handleAddAllergen}
        returnKeyType='done'
        />
      
    </View>
    </View>
    </View>)}
</View>
 
    </ScrollView>
    </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 70,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,

    
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
     mascot: {
      height: 150,
      width: 150,
      shadowColor:'#000',
      shadowRadius: 4,
      shadowOpacity: 1,
      shadowOffset: {width: 0, height: 2},
  },
    label:{
    marginBottom: 7,
    fontSize: 15,
    color:'#262e05ff',
    marginTop: 10,

  },
  input:{
    borderWidth: 1,
    borderColor: '#9BA760',
    borderRadius: 18,
    paddingHorizontal: 20,
    width:350,
    height: 50,
    fontSize: 13,
    justifyContent: 'center',
  },
  button:{
     backgroundColor: '#9BA760', 
    borderRadius: 100, 
    width: 60, 
    height: 30,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  text:{
    color: 'black',
    padding: 10,
    fontSize: 18,

  },
  buttonText:{
    color: 'white',
  },
  icon:{
    backgroundColor: '#9ba76081', 
    borderRadius: 100, 
    width: 30, 
    height: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 10, 
    alignSelf: 'flex-end',
    position: 'relative',
    top: 30,
    left: 10,

  },
    allergen: {
  justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9BA760',
    borderRadius: 100,
    margin: 3,
    paddingHorizontal: 10,
    padding: 10,
    flexBasis: '30%',
  },
     nonAllergen: {
  justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5ebe6ff',
    borderWidth: 1,
    borderColor: '#9BA760',
    borderRadius: 100,
    margin: 3,
    paddingHorizontal: 10,
    padding: 10,
    flexBasis: '30%',
  },
  allergenText:{
    color: '#fff',

  },
   nonAllergenText:{
    color: '#000',

  },
  allergenContainer:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
   greenBox:{
   justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9BA760',
    borderRadius: 100,
    paddingHorizontal: 10,
    padding: 10,
    marginHorizontal: 10,
  },
    plus:{
    backgroundColor: '#262e05ff', 
    borderRadius: 100,  
    alignItems: 'center', 
    justifyContent: 'center', 
  }
  
});
