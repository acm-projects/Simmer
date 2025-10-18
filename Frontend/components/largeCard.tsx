
import { StyleSheet, Text, View, Image, ImageSourcePropType, } from 'react-native';
import FavoriteIcon from '@/components/favoriteIcon';
import { AlarmClock } from 'lucide-react-native'
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';

interface Props{
  title: string;
  image: ImageSourcePropType; 
}

const LargeCard: React.FC<Props>= ({title, image}) => {
  return (
    <View style={styles.container}>
       <Link href='/screens/description'>
   
    <Image source={image} style={styles.image}/>
   
   <View style={styles.icon}>
         <Heart size={22} color="black"/>
         </View>
      <View style={styles.card}>
        
               <Text style={styles.title}>{title}</Text> 
       </View>
       </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 3,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection: 'row',
    height: 110,
    alignItems: 'center',
    padding: 10,
    shadowColor: "#303030ff",
    shadowOffset:{width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image:{
  
    width: 90,
    height: 90,
    borderRadius: 20,
  

  },
  card: {
    height: 70,
    width: 347,
    borderRadius: 15,
  },
  title:{
      fontSize: 20,
      color: '#06402B',
      paddingTop: 15,
      marginLeft: 10,
      width: '60%',
  },
    icon:{
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 2
  },
});



export default LargeCard

