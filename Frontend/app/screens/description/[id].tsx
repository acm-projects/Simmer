
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
         <Text style={styles.title1}>Recipe</Text>
         </View>
    
    
         <TouchableOpacity onPress={() => router.back()}>
         <ArrowLeft size={20} style={styles.arrow}/>
         </TouchableOpacity>

        <View>
            <View style={styles.card}>
               <Image source={{uri:recipe.image_url}} style={styles.image}/>
                <View style={styles.titleBox}>
                    <Text style={styles.title2}>{recipe.title}</Text>
                    <View>
                        <Text style={[styles.text, {fontSize: 15, color: '#fff'}]}>Prep: {recipe?.prep_time}min</Text>
                        <Text style={[styles.text, {fontSize: 15, color:'#fff'}]}>Cook: {recipe?.cook_time}min</Text>
                    </View>
                
                </View>
            </View>

            <View style={styles.desBox}>
                <Text style={styles.title1}>Ingredients</Text>
                 {items.map((item, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 20}}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={[styles.text,{paddingLeft: 2}]}>{item}</Text>
                        </View>
                    ))}
            </View>


             <View style={styles.desBox}>
                <Text style={styles.title1}>Steps</Text>
                {steps.map((steps, index) => (
                        <View key={index} style={{flexDirection: 'row', alignItems: 'flex-end', paddingLeft: 20}}>
                        <Text style={styles.bullet}>{index + 1}.</Text>
                        <Text style={[styles.text,{paddingLeft: 2}]}>{steps}</Text>
                        </View>
                    ))}
            </View>
        </View>

    <Pressable onPress={() => router.push('../screens/cookingMode')}>
      <View style={styles.bubble}>
          <Text style={styles.bubbleText}> Voice Mode </Text>
      </View>
    </Pressable>


             
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
    paddingLeft: 15,
    paddingTop: 5,
    fontFamily: 'Nunito_400Regular',

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
  },
     title2:{
    paddingLeft: 15,
    paddingTop: 5,
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Nunito_700Bold',
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
   padding: 12,
   borderRadius: 16,
   maxWidth: "100%",
   marginVertical: 10,
   alignSelf: "center",
   width: 300,
 },
 bubbleText: {
   fontSize: 16,
   color: "white",
   textAlign: "center",
   fontFamily: 'Nunito_600SemiBold',
 },
});
