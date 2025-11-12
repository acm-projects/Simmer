import react, { useEffect, useState} from 'react'
import { StyleSheet, Text, View,  ImageSourcePropType, TouchableOpacity } from 'react-native';
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useSupabase } from '@/app/contexts/SupabaseContext';
import { getRecipes } from '@/app/utils/recipe';
import { useFavoriteRecipes } from '@/app/contexts/FavoriteRecipeContext';
import { useRecipes } from '@/app/contexts/RecipeContext';
import {Image} from 'expo-image';

interface Recipe {
  title: string;
  image: string; 
  cook_time: number;
  prep_time:number;
  id:string;
  fav:boolean;
  

}

const LargeCard: React.FC<Recipe>= ({title, image, cook_time, prep_time, id,fav}) => {
  const[favorite, setFavorite]= useState(fav);
  const[isLoading,setisLoading]=useState(false);
  const supabase=useSupabase()
  const {setFavoriteRecipes}= useFavoriteRecipes();
  const{recipes,setRecipes}=useRecipes();
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
        await getRecipes(session.access_token,setRecipes)


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
    pathname: `/screens/description/[id]`,
    params: {id}
    }} style={styles.container}>
    <View style={[styles.content, {alignItems:'center'}]}>
       
   
    <Image source={{uri:image}} style={styles.image} onLoadStart={()=>setisLoading(true)} onLoadEnd={()=>setisLoading(false)}/>
    {isLoading&&(<Text style={[styles.time, {alignSelf: 'flex-start'}]}>loading...</Text>)}
   
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
       <View style={[styles.card, {justifyContent: 'center'}]}>
        
               <Text style={styles.title}>{title ?? 'No title'}</Text> 
                   <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, }}>
                         <Text style={styles.time}>Prep: {prep_time} min | Cook: {cook_time} min </Text>       
                    </View>
              
       </View>

      {/*  <View style={[styles.card, {justifyContent: 'center'}]}>
        
               <Text style={styles.title}>PIzzzaaaaanad</Text> 
                   <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, }}>
                         <Text style={styles.time}>Prep: 30 min | Cook: 30 min </Text>       
                    </View>
              
       </View> */}
       
    </View>
    </Link>
  );
}

export default LargeCard;

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderRadius: 20,
    marginHorizontal: 10,
    backgroundColor: 'white',
    shadowColor: "#303030ff",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: 'center',
  },
  content:{
        
    flexDirection: 'row',
    height: 110,
    alignItems: 'center',
    padding: 10,
  },
  image:{
  
    width: 90,
    height: 90,
    borderRadius: 15,
  

  },
  card: {
    height: 70,
    width: 347,
    borderRadius: 15,
    alignItems: 'flex-start'
  },
  title:{
      fontSize: 25,
      color: '#06402B',
      paddingTop: 5,
      marginLeft: 10,
      width: '55%',
      fontFamily: 'Nunito_700Bold',
      flexWrap: 'wrap',
      flexShrink: 1,
  },
    icon:{
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 2
  },
  time:{
    fontSize: 15,
    marginLeft: 4,
    marginTop: 6,
    fontFamily: 'Nunito_400Regular',
   
  }
});


