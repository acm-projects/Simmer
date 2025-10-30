import React, { useState } from 'react';
import { Alert, Button, View, TextInput, Text, TouchableOpacity , StyleSheet, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import { useSupabase } from '../app/contexts/SupabaseContext';
import { Link } from 'expo-router';

const DEFAULT_DIET_RESTRICTIONS = [
  'Wheat',
  'Dairy',
  'Tree Nuts',
  'Peanuts',
  'Soy',
  'Sesame',
  'Eggs',
  'Shellfish',
  'Fish',
];

export default function UserPreference() {
  const supabase=useSupabase();
  const [selectedDietRestrictions, setSelectedDietRestrictions] = useState<Set<string>>(new Set([]));
  const [dietRestrictionTags, setDietRestrictionTags] = useState<string[]>(() => {
    const combined = new Set([... DEFAULT_DIET_RESTRICTIONS]);
    return Array.from(combined);
  });
  const [customDietRestrictionInput, setCustomDietRestrictionInput] = useState('');
  const [message,setMessage]=useState<string|null>(null);

  const handleDietRestrictionPress = (tag:string) => {
    setSelectedDietRestrictions((prevSelected) => {
      const newSelected = new Set<string>(prevSelected);
      if (newSelected.has(tag)) {
        newSelected.delete(tag);
      } else {
        newSelected.add(tag);
      }
      return newSelected;
    });
  };
  const handleAddCustomDietRestrictionTag = () => {
    const newTag = customDietRestrictionInput.trim();

    if (newTag === '') {
      return;
    }

    const isDuplicate = dietRestrictionTags.some(
      (tag) => tag.toLowerCase() === newTag.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Duplicate Tag', `"${newTag}" already exists.`);
      return;
    }

    setDietRestrictionTags([...dietRestrictionTags, newTag]);
    setSelectedDietRestrictions(new Set([...selectedDietRestrictions, newTag]));
    setCustomDietRestrictionInput('');
  };
<<<<<<< HEAD
  //////////////////////
   const [selectedFoodPreference, setSelectedFoodPreference] = useState<Set<string>>(new Set([]));
  const [foodPreferenceTags, setFoodPreferenceTags] = useState<string[]>(() => {
    const combined = new Set([... DEFAULT_FOOD_PREFERENCE]);
    return Array.from(combined);
  });
  const [customFoodPreferenceInput, setCustomFoodPreferenceInput] = useState('');

  const handleFoodPreferencePress = (tag:string) => {
    setSelectedFoodPreference((prevSelected) => {
      const newSelected = new Set<string>(prevSelected);
      if (newSelected.has(tag)) {
        newSelected.delete(tag);
      } else {
        newSelected.add(tag);
      }
      return newSelected;
    });
  };
  const handleAddCustomFoodPreferenceTag = () => {
    const newTag = customFoodPreferenceInput.trim();

    if (newTag === '') {
      return;
    }

    const isDuplicate = foodPreferenceTags.some(
      (tag) => tag.toLowerCase() === newTag.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert('Duplicate Tag', `"${newTag}" already exists.`);
      return;
    }

    setFoodPreferenceTags([...foodPreferenceTags, newTag]);
    setSelectedFoodPreference(new Set([...selectedFoodPreference, newTag]));
    setCustomFoodPreferenceInput('');
  };

  const submitPreference=async ()=>{
    try{
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error){ 
        setMessage(error.message)
        return;
      }
      if(!session){
        setMessage(`Session doesn't exist, please try again.`)
        return;
      }

      console.log(session.access_token)
      console.log(session.user.id)


      await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/set-preference`, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
              id:session.user.id,
              "diet_restriction":[...selectedDietRestrictions],
              "food_preference":[...selectedFoodPreference]

          })
      })
      setMessage("Preferenced has been changed");
    }catch(error){
      console.error('Fetch error:', error);
    }
  }
=======
>>>>>>> frontend
 

 


  return (
    <ScrollView style={styles.container}>
       <Link href='/voiceAssistant'><Text style={styles.title}>Dietary Restrictions</Text></Link>
      <Text style={styles.label}>Select Options</Text>
      <View style={styles.tagContainer}>
        {dietRestrictionTags.map((tag) => {
          const isSelected = selectedDietRestrictions.has(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, isSelected && styles.tagSelected]}
              onPress={() => handleDietRestrictionPress(tag)}>
                <Image />
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Add Another Allergen</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Other Allergen"
          value={customDietRestrictionInput}
          onChangeText={setCustomDietRestrictionInput}
          onSubmitEditing={handleAddCustomDietRestrictionTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCustomDietRestrictionTag}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>

         

      </View>
      <TouchableOpacity style={styles.doneButton}>
         <Link href='../homepage'> <Text style={styles.addButtonText}>Done</Text> </Link>
        </TouchableOpacity>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    backgroundColor: '#f5ebe6ff',
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
    color: '#333',
    fontFamily: 'Nunito_700Bold'
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-evenly'
  },
  tag: {
  justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9BA760',
    borderRadius: 100,
    margin: 1,
    paddingHorizontal: 10,
    padding: 10,
  },
  tagSelected: {
     justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E321E',
    borderRadius: 100,
    margin: 1,
  },
  tagText: {
    fontSize: 14,
    color: '#fff',
    fontFamily:'Nunito_400Regular'
  },
  tagTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Nunito_400Regular'
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#2E321E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 100,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito_400Regular'
  },
  title:{
    fontSize:24,
    marginTop:10,
    fontFamily: 'Nunito_700Bold'
  },
    doneButton: {
    backgroundColor: '#2E321E',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 100,
    width: 100,
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',

  },
});
