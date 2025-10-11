;
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold} from '@expo-google-fonts/orbitron'
import TabLayout from '../(tabs)/_layout';


export default function ImportRecipe(){

    return(
        <ScrollView style={styles.container}>
     
     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
         <Text style={styles.title}>Recipes</Text>
         </View>
    
    
         <View>
         <ArrowLeft size={20} style={styles.arrow}/>
         </View>
            
            <View style={{position: 'relative' , top: 20}}>
            <View style={styles.greenBox}>
                <Text style={styles.text}>Import</Text>
            </View>
             </View>
             <TabLayout/>
        </ScrollView>
    )}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fce6dbff',
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
    padding: 5,
    alignItems: 'center',
    margin: 5,

  }
});
