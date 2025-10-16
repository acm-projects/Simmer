;
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Image, Button } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold} from '@expo-google-fonts/orbitron'
import TabLayout from '../(tabs)/_layout';


export default function ImportRecipe({title, prep, }){

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
             

             <View>
                         <View style={styles.card}>
                            <View style={styles.image}></View>
                             <View style={styles.titleBox}>
                                 <Text style={styles.title2}>Title</Text>
                                 <View>
                                     <Text style={[styles.text, {fontSize: 15, color: '#fff'}]}>Prep: __min</Text>
                                     <Text style={[styles.text, {fontSize: 15, color:'#fff'}]}>Cook: __min</Text>
                                 </View>
                             
                             </View>
                         </View>
             
                         <View style={styles.desBox}>
                             <Text style={styles.title1}>Ingredients</Text>
                               <View style={{flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 20}}>
                                <Text style={styles.bullet}>{'\u2022'}</Text>
                                <Text style={[styles.text,{paddingLeft: 2}]}>ingredient 1</Text>
                              </View>

                              
                             <View style={{backgroundColor: '#9BA760', borderRadius: 15,}}>Add Ingredient</View> 
                         </View>
             
                          <View style={styles.desBox}>
                             <Text style={styles.title1}>Steps</Text>
                             <View style={{flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 20}}>
                                <Text style={styles.bullet}>1.</Text>
                                <Text style={[styles.text,{paddingLeft: 2}]}>Step 1</Text>
                              </View>
                            
                                <View style={{backgroundColor: '#9BA760', borderRadius: 15,}}>Add Ingredient</View> 
                            
                              
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
    borderColor: 'black',
  }
});
