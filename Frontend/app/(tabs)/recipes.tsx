import {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import LargeCard from "@/components/largeCard";
import { useSupabase } from '../../app/contexts/SupabaseContext';

interface Recipe {
  title: string;
  image: string;
  cookTime: string;
  prepTime: string;
}

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const[loading, setLoading]=useState(true);
  const [message,setMessage]=useState<string|null>(null);

  useEffect(()=> {
    const supabase=useSupabase();
    const fetchSavedRecipes = async () => {
        
      try{
        const{ data: {session}, error} = await supabase.auth.getSession();

        if(error){
          setMessage(error.message);
          setLoading(false);
          return;
        }

        if(!session){
          setMessage(`Session doesn't exist, please try again.`);
          setLoading(false);
          return;
        }

        console.log(session.access_token);
        console.log(session.user.id);

        // Fetch saved recipes
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/saved-recipe`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':  `Bearer ${session.access_token}`
          }
        });

        if(!response.ok){
          throw new Error('Failed to fetch saved recipes');
        }

        const data = await response.json();
        setRecipes(data);
        setMessage("Saved recipes loaded successfully");
        console.log("saved successful");
        console.log(data);
        setLoading(false);
      } 
      catch(error){
        console.error('Fetch error:', error);
        setMessage(error instanceof Error ? error.message : 'An error occurred');
        setLoading(false);
      }
    };
    fetchSavedRecipes();
  }, []);
    
  return (
    <ScrollView style={styles.container}>
      <Text>{recipes[0].title}</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.title}>Recipes</Text>
     </View>

<View style ={{marginTop: 20}}>
<Text style={styles.text}>
  {loading ? 'Loading...' : `${recipes.length} Recipes`}</Text>
{recipes.map(recipe =>
  <LargeCard recipe={recipe}/>
)}
 

</View>

          <StatusBar style="auto" />
        </ScrollView>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 30,
  },
  content:{
    padding: 1,
    top: 30,
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
    fontFamily: 'Nunito_700Bold',
  },
  text:{
    fontSize: 16,
    paddingLeft: 25,
    paddingBottom: 5,
    fontFamily: 'Nunito_400Regular'
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
  icons: {
    flexDirection: 'row',
    margin: 5,
    marginRight: 8,
    marginTop: 15,
  },
   arrow: {
   color: "#9BA760",
   position: "absolute",
   left: 25,
   top: -25,
 },
});
