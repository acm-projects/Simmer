import React, { useState } from 'react';
import { Alert, Button, View, TextInput, Text, TouchableOpacity , StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import { useSupabase } from '../app/contexts/SupabaseContext';
import { Link } from 'expo-router';

const DEFAULT_DIET_RESTRICTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Nut-Free',
  'Pescatarian',
];
const DEFAULT_FOOD_PREFERENCE = [
  'Asian',
  'Coffee',
  'Mexican',
  'Deserts',
  'Breakfast',
  'Dinner',
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
 

 


  return (
    <SafeAreaView style={styles.container}>
       <Link href='/voiceAssistant'>Temporary link to homepage</Link>
      <Text style={styles.title}>Dietary Restriction</Text>
      <Text style={styles.label}>Select Options</Text>
      <View style={styles.tagContainer}>
        {dietRestrictionTags.map((tag) => {
          const isSelected = selectedDietRestrictions.has(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, isSelected && styles.tagSelected]}
              onPress={() => handleDietRestrictionPress(tag)}>
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Add Your Own</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="any dietary restriction"
          value={customDietRestrictionInput}
          onChangeText={setCustomDietRestrictionInput}
          onSubmitEditing={handleAddCustomDietRestrictionTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCustomDietRestrictionTag}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {/*-----------------------------------------------------*/}
      <Text style={styles.title}>Food Preference</Text>
      <Text style={styles.label}>Select Options</Text>
      <View style={styles.tagContainer}>
        {foodPreferenceTags.map((tag) => {
          const isSelected = selectedFoodPreference.has(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, isSelected && styles.tagSelected]}
              onPress={() => handleFoodPreferencePress(tag)}>
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                {tag}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Add Your Own</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="any food preference"
          value={customFoodPreferenceInput}
          onChangeText={setCustomFoodPreferenceInput}
          onSubmitEditing={handleAddCustomFoodPreferenceTag}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCustomFoodPreferenceTag}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>  
      <Text>{"\n\n"}</Text>
      <Button title="submit" onPress={submitPreference}/>
      {message&&<Text>{message}</Text>}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 15,
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E8E8E8',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  tagSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  tagTextSelected: {
    color: '#FFFFFF',
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
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title:{
    fontSize:24,
    fontWeight: 'bold',
    marginTop:10
  }
});
