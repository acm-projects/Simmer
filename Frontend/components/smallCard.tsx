
import { StyleSheet, Text, View, Image, ImageSourcePropType, Dimensions } from 'react-native';
import FavoriteIcon from '@/components/favoriteIcon';
import WavyBox from '@/components/wavyBox'
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';


interface Props{
  title: string;
  image: ImageSourcePropType; 
}
const SmallCard: React.FC<Props>= ({title, image }) => {

  return (
    <Link href="../screens/description">
       <View style={styles.container}>
        
       <Image source={image} style={styles.image}/>
          
          <View style={styles.icon}>
          <Heart size={20} color="#9BA760"/>
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
    margin: 10,
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
      fontSize: 18,
      color: '#262e05ff',
      fontFamily: 'Nunito_700Bold',
      flexWrap: 'wrap',
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
