import react, { useState} from 'react'
import { StyleSheet, Text, View, Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import FavoriteIcon from '@/components/favoriteIcon';
import { Clock2 } from 'lucide-react-native'
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';

interface Props{
  title: string;
  image: ImageSourcePropType; 
  

}


const LargeCard: React.FC<Props>= ({title, image}) => {
  const[favorite, setFavorite]= useState(false);



  return (
    <Link href="../screens/description" style={styles.container}>
    <View style={[styles.content, {alignItems:'center'}]}>
       
   
    <Image source={image} style={styles.image}/>
   
      <View style={styles.icon}>
             {!favorite ? (
                 <TouchableOpacity onPress={()=> setFavorite(true)}>
                    <Heart size={20} color="#9BA760"/>
                 </TouchableOpacity>
                
             ) : (
               <TouchableOpacity onPress={()=> setFavorite(false)}>
             <Heart size={20} color="#9BA760" fill="#9BA760"/>
             </TouchableOpacity>
           )}
   
             
             
             </View>
      <View style={[styles.card, {justifyContent: 'center'}]}>
        
               <Text style={styles.title}>{title}</Text> 
                   <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, }}>
                         <Text style={styles.time}>Prep: 30 min | Cook: 20 min </Text>       
                    </View>
              
       </View>
       
    </View>
    </Link>
  )
}

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
      width: '60%',
      fontFamily: 'Nunito_700Bold',
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



export default LargeCard

