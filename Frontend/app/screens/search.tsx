import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';


export default function SearchScreen() {
  return (
<ScrollView style={styles.container}>
    <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <ArrowLeft size={20} style={{margin: 5}}/>
    <View style={[styles.greenBox, {width: '85%'}]}>
        <Text style={styles.text}>Search</Text>
    </View>
    </View>

<Text style={styles.subtitle}>Time</Text>

<View style={{alignItems:'center'}}>
<View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> 30 min </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Breakfast </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Lunch </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Dinner </Text>
    </View>
    
</View>
</View>

<Text style={styles.subtitle}>Protein</Text>
<View style={{alignItems:'center'}}>


    <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Chicken </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Beef </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Pork </Text>
    </View>
    
    </View>
    
    <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Seafood </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Vegan </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Vegetarian </Text>
    </View>
    
    </View>
    </View>
<Text style={styles.subtitle}>Type</Text>
<View style={{alignItems:'center'}}>


    <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Sides </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Soups </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Entree </Text>
    </View>
    
    </View>
    
    <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Snack </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Drinks </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Dessert </Text>
    </View>
    
    </View>
    </View>
<Text style={styles.subtitle}>Allergens</Text>
<View style={{alignItems:'center'}}>


    <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Eggs </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Peanuts </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Tree Nuts </Text>
    </View>
    
    </View>
    
    <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Milk </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Sesame </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Fish </Text>
    </View>
    
    </View>
       <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Shellfish </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Gluten </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Wheat </Text>
    </View>
    
    </View>
       <View style={styles.grid}>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Soy </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Citrus </Text>
    </View>
    <View style={styles.gridItem}>
        <Text style={styles.text}> Corn </Text>
    </View>
    
    </View>
    <View style={[styles.greenBox, {width: '90%', marginTop: 10,}]}>
        
        <Text style={styles.text}>+    Add Other</Text>
    </View>
    <View style={[styles.greenBox,{marginTop: 10, width: 110, alignItems:'center', paddingLeft: 0, backgroundColor: '#262e05ff'}]}>
    <Text style={styles.text}>Search</Text>
    </View> 
    </View>
    


</View>
</ScrollView>
  )

}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f1e2dbff',
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

  },
  grid:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // pushes left/right
    width: '90%', 
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

 
});
