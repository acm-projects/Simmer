import {useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import CollapsibleSection from '@/components/collapsibleSection'
import { Plus } from 'lucide-react-native';

export default function SearchScreen() {
    const [search, setSearch] = useState('');
    const time = [
        { item: '5 min'},{ item: '1 hour'}, { item: '30 min'}, {item: 'Breakfast'},{ item: 'Lunch' }, {item: "Dinner"}];
    const protein = [
        { item: 'Chicken'}, {item: 'Beef'},{ item: 'Pork' }, {item: "Seafood"}, { item: 'Vegan'}, {item: 'Vegetarian'}];
    const type = [
        { item: 'Snack'}, {item: 'Drinks'},{ item: 'Entrees' }, {item: "Appetizers"}, { item: 'Soups' }, {item: "Salads"}];
    const allergen = [
        { item: 'Eggs'}, {item: 'Peanuts'},{ item: 'Treenuts' }, {item: "Sesame"}, {item: "Milk"}, {item: "Wheat"}, {item: "Soy"}, {item: "Fish"}, {item: "Shelfish"}];

const [selected, setSelected] = useState<string[]>([]);

const toggle = (item: string) => {
  setSelected((prev) =>
    prev.includes(item)
      ? prev.filter((p) => p !== item) // remove if already selected
      : [...prev, item] // add if not selected
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
    <View style={[styles.greenBox, {width: '85%'}]}>
        <TextInput 
        style={styles.text}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
        />
    </View>
    </View>


<View style={{paddingTop: 15}}>
<CollapsibleSection title="Time" isVisible={showTime} setIsVisible={setShowTime}>


<View style={{ alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(time.length / 3) }, (_, rowIndex) => {
    const rowItems = time.slice(rowIndex * 3, rowIndex * 3 + 3);
    return (
      <View key={rowIndex} style={styles.grid}>
        {rowItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[{flexDirection: 'row'}, styles.gridItem, selected.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.item)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selected.includes(item.item) && (
                <Text style={[styles.text, styles.x]}>x</Text>
                )}  
          </TouchableOpacity>
        ))}
      </View>
    );
  })}
</View>
</CollapsibleSection>


<CollapsibleSection title="Protein" isVisible={showProtein} setIsVisible={setShowProtein}>
<View style={{ alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(protein.length / 3) }, (_, rowIndex) => {
    const rowItems = protein.slice(rowIndex * 3, rowIndex * 3 + 3);
    return (
      <View key={rowIndex} style={styles.grid}>
        {rowItems.map((item, index) => (
           <TouchableOpacity
            key={index}
            style={[{flexDirection: 'row'}, styles.gridItem, selected.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.item)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selected.includes(item.item) && (
                <Text style={[styles.text, styles.x]}>x</Text>
                )}  
          </TouchableOpacity>
        ))}
      </View>
    );
  })}
</View>
</CollapsibleSection>


<CollapsibleSection title="Type" isVisible={showType} setIsVisible={setShowType}>
<View style={{ alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(type.length / 3) }, (_, rowIndex) => {
    const rowItems = type.slice(rowIndex * 3, rowIndex * 3 + 3);
    return (
      <View key={rowIndex} style={styles.grid}>
        {rowItems.map((item, index) => (
            <TouchableOpacity
            key={index}
            style={[{flexDirection: 'row'}, styles.gridItem, selected.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.item)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selected.includes(item.item) && (
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
            style={[{flexDirection: 'row'}, styles.gridItem, selected.includes(item.item) && styles.gridItemSelected]}
            onPress={() => toggle(item.item)}>
               
           <Text style={[styles.text]}>{item.item}</Text>
                {selected.includes(item.item) && (
                <Text style={[styles.text, styles.x]}>x</Text>
                )}  
          </TouchableOpacity>
        ))}
      </View>
    );
  })}

<View style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
    <Plus color={'white'} size={22}style={styles.plus}/>
    <View style={[styles.greenBox, {width: '90%', marginTop: 10,}]}>
        
        <TextInput 
        style={styles.text}
        placeholder='Add Other'
        value={newAllergen}
        onChangeText={setNewAllergen}
        ></TextInput>
      
    </View>
    </View>
    </View>
    </CollapsibleSection>
    <View style={{alignItems: 'center', width: '100%'}}>
    <TouchableOpacity style={[styles.greenBox,{marginTop: 10, width: 110, alignItems:'center', backgroundColor: '#262e05ff', paddingLeft: 10}]}>
    <Text style={styles.text}>Search</Text>
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
    padding: 5,
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
  },
  text:{
    fontSize: 15,
    color:'white',
    margin: 3,
    marginLeft: 1,
    marginRight: 1,
  },
  subtitle:{
    fontSize: 18,
    color: '#2E321E',
    paddingLeft: 10,
    paddingTop: 15,
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
