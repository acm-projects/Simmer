import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';


export default function SearchScreen() {
  return (
<ScrollView>
<Text>Search</Text>
<Text style={styles.subtitle}>Time</Text>
<Text style={styles.subtitle}>Protein</Text>
<Text style={styles.subtitle}>Type</Text>
<Text style={styles.subtitle}>Allergens</Text>

<Text>Search</Text>
</ScrollView>
  )

}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fce6dbff',
    paddingTop: 50,
    paddingLeft: 15,
    paddingRight: 15,
  },
  content:{
    padding: 1,
    top: 50,
  },
  gridItem: {
    flex: 1, // Ensures items take equal space in a row

    justifyContent: 'center',
    alignItems: 'center',
  },
  grid:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },
  title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
  text:{
    fontSize: 15,
    paddingLeft: 15,
    color:'white',
  },
  subtitle:{
    fontSize: 20,
    color: '#2E321E',
    paddingLeft: 15,
    paddingTop: 15,
  },  
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes left/right
    width: '100%', // make sure it spans full width
  },
 
});
