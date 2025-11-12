import react, {useEffect, useRef, useState} from 'react'
import { StyleSheet, Text, View, Image, ImageSourcePropType, TouchableOpacity,  } from 'react-native';
import FavoriteIcon from '@/components/favoriteIcon';
import WavyBox from '@/components/wavyBox'
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { useFavoriteRecipes } from '@/app/contexts/FavoriteRecipeContext';
import { useSupabase } from '@/app/contexts/SupabaseContext';
import { useRecipes } from '@/app/contexts/RecipeContext';
import { getRecipes } from '@/app/utils/recipe';


interface Props{
  title: string;
  image: string; 
  id: string;
  fav:boolean;
}
const SmallCard: React.FC<Props>= ({title, image, id ,fav}) => {

  const [favorite, setFavorite] = useState(fav);
  const hasLoadedOnce = useRef(false);
  const[isLoading,setisLoading]=useState(!hasLoadedOnce.current);
  const supabase=useSupabase()
  const {setFavoriteRecipes}= useFavoriteRecipes();
  const{recipes,setRecipes}=useRecipes();
  const handleLoadEnd = () => {
   if (!hasLoadedOnce.current) {
      hasLoadedOnce.current = true;
    }
    setisLoading(false);
  }
  useEffect(() => {
      setFavorite(fav);
    }, [fav]);
   const toggleFavorite= async()=>{
    // if(favorite)
    //   setFavoriteRecipes((recipes)=>recipes?.filter((recipe)=>recipe.id!==id))
    // else
    //   setFavoriteRecipes((favoriteRecipes:any[] | undefined)=>[recipes?.find((recipe=>recipe.id===id)),...(favoriteRecipes??[])])
    setFavorite((favorite)=>!favorite)
    


    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error){ 
        return;
      }
      if(!session){
        return;
      }

      const response =  await fetch(`${process.env.EXPO_PUBLIC_API_URL}toggle-favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify({'recipe_id':id})
      });
      const data = await response.json();
      if (response.ok) {
        await getRecipes(session.access_token,setRecipes);


      } else {
        alert(`Error: ${data.error || 'Failed to toggle favorite'}`);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Could not connect to server");
    }


  }

  return (
    <Link href={{
    pathname: `../screens/description/${id}`,
    params: {}}}>
       <View style={styles.container}>
        
       <Image source={{uri:image}} style={styles.image} onLoadStart={() => {if (!hasLoadedOnce.current) setisLoading(true);}} onLoadEnd={()=>handleLoadEnd()}/>
        {isLoading&&(<Text>loading...</Text>)} 
          <View style={styles.icon}>
          {!favorite ? (
              <TouchableOpacity onPress={()=> toggleFavorite()}>
                 <Heart size={20} color="#9BA760"/>
              </TouchableOpacity>
             
          ) : (
            <TouchableOpacity onPress={()=> toggleFavorite()}>
          <Heart size={20} color="#9BA760" fill="#9BA760"/>
          </TouchableOpacity>
        )}

          
          
          </View>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text> 
          <Text style={styles.text}>Time: 50 min</Text>
          <WavyBox/>
          </View>
        </View>

    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 20,
    height: 200,
    width: 150,
    shadowColor: '#000000ff',
    shadowOffset:{width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image:{
    width: 150,
    height: 130,
    borderRadius: 15,
    position: 'absolute',
    bottom: 40,
   
  },
  card: {
    width: 150,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    alignItems: 'flex-start'
    
    },
  title:{
      fontSize: 17,
      color: '#262e05ff',
      fontFamily: 'Nunito_700Bold',
      flexWrap: 'wrap',
      flexShrink: 1,
      maxHeight: 23,
      width: '93%',
      position: 'absolute',
      bottom: 30,
      paddingLeft: 13,
      zIndex: 1,

  },
    text:{
      fontSize: 13,
      color: '#262e05ff',
      fontFamily: 'Nunito_600SemiBold',
      flexWrap: 'wrap',
      position: 'absolute',
      bottom: 12,
      paddingLeft: 15,
      zIndex: 1,

  },
  icon:{
    position: 'absolute',
    top:37,
    right: 10,
    zIndex: 2,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 4,
  },
});



export default SmallCard
