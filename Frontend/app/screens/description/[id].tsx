
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { Heart } from 'lucide-react-native';
import { router,useLocalSearchParams} from 'expo-router';
import { useRecipes } from '@/app/contexts/RecipeContext';




export default function Description(){
    const {id} = useLocalSearchParams<any>();
    const {recipes}=useRecipes();
    const recipe=recipes?.find((recipe)=>(recipe.id===id))
    const items = recipe.ingredients.map((ingredient:any)=>`${ingredient.quantity} ${ingredient.unit} of ${ingredient.name}`);
    console.log(id)
    const steps = recipe.instructions.steps.map((step:any)=>step.description)
   

    const navigation = useNavigation();

    return(
        <ScrollView style={styles.container}>
            <View style={{ justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.toptitle}>Recipe</Text>
                </View>
           
           
                <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={20} style={styles.arrow}/>
                </TouchableOpacity>

        <View>
            <View style={styles.card}>
               <Image source={{uri:recipe.image_url}} style={styles.image}/>
                <View style={styles.titleBox}>
                    <Text style={styles.title2}>{recipe.title}</Text>
                    <View style={{width: '100%', paddingLeft: 10,}}>
                      <View style={{}}>
                          <Text style={[styles.text, {fontSize: 15, color: '#fff', }]}>Prep: {recipe?.prep_time}min</Text>
                      </View>
                        
                        <View style={{flex: 1, flexDirection: 'row'}}>
                          <Text style={[styles.text, {fontSize: 15, color: '#fff', }]}>Cook: {recipe?.cook_time}min</Text>
                      
                      </View>
                    </View>
                
                </View>
            </View>
           

           <View style={styles.desBox}>
            <View style={{flexDirection: 'row'}}>
               <Text style={styles.title1}>Ingredients</Text>
                <Pressable onPress={() => router.push('../../screens/cookingMode')}>
                <View style={styles.bubble}>
                <Text style={styles.bubbleText}> Voice Mode </Text>
                </View>
            </Pressable>
            </View>
               
                 {items.map((item: string, index: number) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'flex-center', paddingLeft: 20}}>
                        <Text style={[styles.bullet, { position: 'relative', top: 5,}]}>{'\u2022'}</Text>
                        <Text style={[styles.text,{paddingLeft: 2}]}>{item}</Text>
                        </View>
                    ))}
            </View>


             <View style={styles.desBox}>
                <Text style={styles.title1}>Steps</Text>
                {steps.map((steps: string, index: number) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 20}}>
                        <Text style={[styles.bullet, { position: 'relative', top: 6,}]}>{index + 1}.</Text>
                        <Text style={[styles.text,{paddingLeft: 2}]}>{steps}</Text>
                        </View>
                    ))}
            </View>
            

          
      

           
        </View>

    


             
        </ScrollView>
    )}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 60,
    paddingLeft: 15,
    paddingRight: 15,
  },
  content:{
    padding: 1,
    top: 1,
  },
    text:{
    fontSize: 16,
    color: '#000',
    paddingTop: 5,
    fontFamily: 'Nunito_400Regular',
    width: '90%',

  },
  heart:{
    backgroundColor: '#2E321E',
    borderRadius: 100,
    padding: 4,
    margin: 2,
    height: 34,
    width: 34,
    justifyContent: 'center',
    alignItems: 'center',
},
    arrow: {
   color: "#9BA760",
   position: "absolute",
   left: 25,
   top: -25,
 },
    title1:{
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 25,
    color: '#9BA760',
    fontFamily: 'Nunito_700Bold',
    width: '65%',
  },
     title2:{
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
    width: '70%'
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
  },
  bubble: {
   backgroundColor: '#9BA760',
   padding: 10,
   borderRadius: 16,
   maxWidth: "100%",
   marginVertical: 5,
   alignSelf: "center",
   
 },
 bubbleText: {
   fontSize: 14,
   color: "white",
   textAlign: "center",
   fontFamily: 'Nunito_600SemiBold',
 },
 toptitle:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
    fontFamily: 'Nunito_700Bold',
 }
});
