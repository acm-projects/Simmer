import {Dispatch, SetStateAction, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import CollapsibleSection from '@/components/collapsibleSection'
import { Plus } from 'lucide-react-native';
import { useRecipes } from '../contexts/RecipeContext';
import { useSearchRecipes } from '../contexts/SearchRecipeContext';

export default function SearchScreen() {
    const [search, setSearch] = useState('');
    const time = [
        { item: '5 min', time:5},{ item: '1 hour', time: 60}, { item: '30 min', time:30}];
    const protein = [
        { item: 'Chicken'}, {item: 'Beef'},{ item: 'Pork' }, {item: "Seafood"}, { item: 'Vegan'}, {item: 'Vegetarian'}];
    const type = [
        { item: 'Sides'}, {item: 'Drinks'},{ item: 'Entrees' }, {item: "Desserts"}, { item: 'Soups' }, {item: "Salads"}];
    const allergen = [
        { item: 'Eggs'}, {item: 'Peanuts'},{ item: 'Treenuts' }, {item: "Sesame"}, {item: "Milk"}, {item: "Wheat"}, {item: "Soy"}, {item: "Fish"}, {item: "Shelfish"}];

// const [selected, setSelected] = useState<string[]>([]);
const [selectedTimes,setSelectedTimes]=useState<any[] | undefined>([]);
const [selectedProteins,setSelectedProteins]=useState<any[] | undefined>([]);
const [selectedTypes,setSelectedTypes]=useState<any[] | undefined>([]);
const [selectedAllergens,setSelectedAllergens]=useState<any[] | undefined>([]);
const {recipes}=useRecipes();
const{searchRecipes,setSearchRecipes}=useSearchRecipes()
const searchItems= ()=>{
  
  const timeAr=selectedTimes?.map(time=>time)
  const proteinAr=selectedProteins?.map(protein=>protein.toLowerCase())
  const typeAr=selectedTypes?.map(type=>type.toLowerCase())
  const allergenAr=selectedAllergens?.map(allergen=>allergen.toLowerCase())
  console.log('8888888888888888888')
  console.log(recipes)
  let filterRecipes=recipes?.filter(recipe=>{
    for(const time of timeAr)
      if(recipe.cook_time+recipe.prep_time>time)
        return false;
    return true
  })
  console.log('99999999999999999999')
  console.log(filterRecipes)
  filterRecipes=filterRecipes?.filter(recipe=>{
    console.log('pppppppppppppppppppp')
    console.log(recipe.protein)
    if(!proteinAr||proteinAr?.length===0)
      return true
    for(const protein of proteinAr){
      if(recipe.protein.some(item => {
        console.log('ffffffffffffffffffffff')
        console.log(item)
        console.log(protein)
        return item.toLowerCase().includes(protein.toLowerCase())}))
        return true;
    }
    return false;
  })
  console.log('uuuuuuuuuuuuuuuuuuu')
    console.log(filterRecipes)
  filterRecipes=filterRecipes?.filter(recipe=>{
    if(!typeAr||typeAr?.length===0)
      return true
    for(const type of typeAr)
      if(recipe.type.toLowerCase()===type.toLowerCase())
        return true;
    return false;
  })
  filterRecipes=filterRecipes?.filter(recipe=>{
    if(!allergenAr||allergenAr?.length===0)
      return true
    for(const allergen of allergenAr)
      if(recipe.ingredients.some(item => item.name.toLowerCase().includes(allergen.toLowerCase())))
        return true;
    return false;
  })
  filterRecipes=filterRecipes?.filter(recipe=>{
    if(search==='')
      return true;
    if(recipe.title.toLowerCase().includes(search.toLowerCase()))
      return true
  })
  setSearchRecipes(filterRecipes);


}

const toggle = (item: any,setSelected:Dispatch<SetStateAction<any[] | undefined>>) => {
  setSelected((prev) =>
    prev?.includes(item)
      ? prev.filter((p) => p !== item) // remove if already selected
      : [...(prev||[]), item] // add if not selected
  );
};

const [showTime, setShowTime] = useState(false);
const [showProtein, setShowProtein] = useState(false);
const [showType, setShowType] = useState(false);
const [showAllergen, setShowAllergen] = useState(false);
const [newAllergen, setNewAllergen] = useState('');


  return (
<View style={styles.container}>
      <KeyboardAvoidingView 
          style={{flex: 1}}
          behavior={Platform.OS === "ios" ? "padding": undefined}
          keyboardVerticalOffset={0}
          >
    <ScrollView>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => router.back()}>
    <ArrowLeft size={20} style={{margin: 5}}/>
    </TouchableOpacity>
    <View style={[styles.greenBox, {width: '85%',  height: 45,}]}>
        <TextInput 
        style={[styles.text, {margin: 14,}]}
        placeholder="Search"
        placeholderTextColor="#e0e0e0ff"
        value={search}
        onChangeText={setSearch}
        />
    </View>
    </View>


<View style={{paddingTop: 15}}>
<CollapsibleSection title="Times" isVisible={showTime} setIsVisible={setShowTime}>


<View style={{ alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(time.length / 3) }, (_, rowIndex) => {
    const rowItems = time.slice(rowIndex * 3, rowIndex * 3 + 3);
    return (
      <View key={rowIndex} style={styles.grid}>
        {rowItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[{flexDirection: 'row'}, styles.gridItem, selectedTimes.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.time,setSelectedTimes)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selectedTimes.includes(item.item) && (
                <Text style={[styles.text, styles.x]}>x</Text>
                )}  
          </TouchableOpacity>
        ))}
      </View>
    );
  })}
</View>
</CollapsibleSection>


<CollapsibleSection title="Proteins" isVisible={showProtein} setIsVisible={setShowProtein}>
<View style={{ alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(protein.length / 3) }, (_, rowIndex) => {
    const rowItems = protein.slice(rowIndex * 3, rowIndex * 3 + 3);
    return (
      <View key={rowIndex} style={styles.grid}>
        {rowItems.map((item, index) => (
           <TouchableOpacity
            key={index}
            style={[{flexDirection: 'row'}, styles.gridItem, selectedProteins.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.item,setSelectedProteins)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selectedProteins.includes(item.item) && (
                <Text style={[styles.text, styles.x]}>x</Text>
                )}  
          </TouchableOpacity>
        ))}
      </View>
    );
  })}
</View>
</CollapsibleSection>


<CollapsibleSection title="Types" isVisible={showType} setIsVisible={setShowType}>
<View style={{ alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(type.length / 3) }, (_, rowIndex) => {
    const rowItems = type.slice(rowIndex * 3, rowIndex * 3 + 3);
    return (
      <View key={rowIndex} style={styles.grid}>
        {rowItems.map((item, index) => (
            <TouchableOpacity
            key={index}
            style={[{flexDirection: 'row'}, styles.gridItem, selectedTypes.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.item,setSelectedTypes)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selectedTypes.includes(item.item) && (
                <Text style={[styles.text, styles.x]}>x</Text>
                )}  
          </TouchableOpacity>
        ))}
      </View>
    );
  })}
</View>
</CollapsibleSection>


<CollapsibleSection title="Allergens" isVisible={showAllergen} setIsVisible={setShowAllergen}>
<View style={{ alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(allergen.length / 3) }, (_, rowIndex) => {
    const rowItems = allergen.slice(rowIndex * 3, rowIndex * 3 + 3);
    return (
      <View key={rowIndex} style={styles.grid}>
        {rowItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[{flexDirection: 'row'}, styles.gridItem, selectedAllergens.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.item,setSelectedAllergens)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selectedAllergens.includes(item.item) && (
                <Text style={[styles.text, styles.x]}>x</Text>
                )}  
          </TouchableOpacity>
        ))}
      </View>
    );
  })}

<View style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
    <Plus color={'white'} size={22}style={styles.plus}/>
    <View style={[styles.lightGreenBox, {width: '90%', marginTop: 10,}]}>
        
        <TextInput 
        style={[styles.text, {margin: 3,}]}
        placeholder='Add Other'
        placeholderTextColor="#e0e0e0ff"
        value={newAllergen}
        onChangeText={setNewAllergen}
        ></TextInput>
      
    </View>
    </View>
    </View>
    </CollapsibleSection>
    <View style={{alignItems: 'center', width: '100%'}}>
    <TouchableOpacity style={[styles.greenBox,{marginTop: 10, paddingLeft: 0, width: 115, alignItems:'center', backgroundColor: '#262e05ff'}]} onPress={searchItems}>
    <Text style={[styles.text, {paddingLeft: 0}]}>Search</Text>
    </TouchableOpacity>
    </View>
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
    
  },
  content:{
    padding: 1,
    top: 1,
  },
  greenBox:{
    backgroundColor: '#9BA760',
    paddingLeft: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100,
  },
   lightGreenBox:{
    backgroundColor: '#9BA760',
    paddingLeft: 15,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100,
  },
  gridItem: {
    flex: 1, // Ensures items take equal space in a row

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9BA760',
    borderRadius: 100,
    margin: 3,
    paddingHorizontal: 4,

  },
   gridItemSelected: {
    flex: 1, // Ensures items take equal space in a row

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E321E',
    borderRadius: 100,
    margin: 3,


  },
  grid:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // pushes left/right
    width: '92%', 
    paddingTop: 10,
    
  },
  title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
    fontFamily: 'Nunito_700Bold',
  },
  text:{
    fontSize: 15,
    color:'white',
    margin: 3,
    marginLeft: 1,
    marginRight: 1,
    fontFamily: 'Nunito_400Regular',
  },
  subtitle:{
    fontSize: 18,
    color: '#2E321E',
    paddingLeft: 10,
    paddingTop: 15,
    fontFamily: 'Nunito_600SemiBold',
  },  
  x:{
    position: 'absolute',
    transform: [{ translateY: -1}],
    right: 5, 
    fontSize: 15

  },
  plus:{
    backgroundColor: '#262e05ff', 
    borderRadius: 100,  
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10,
  }

 
});
