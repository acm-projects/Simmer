
import { StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native';
import FavoriteIcon from '@/components/favoriteIcon';
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';

interface Props{
  title: string;
  image: ImageSourcePropType; 
}
const SmallCard: React.FC<Props>= ({title, image }) => {

  return (
    <Link href="../screens/description" style={styles.container}>
         <View style={styles.container}>
       <View style={styles.icon}>
         <Heart size={22} color="black"/>
         </View>
         <Image source={image} style={styles.image}/>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text> 
       </View>
    </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000000ff',
    shadowOffset:{width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image:{
    width: 150,
    height: 160,
    borderRadius: 15,
    bottom: 0
   
  },
  card: {
    width: 150,
    height: 60,
    backgroundColor: 'white',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    padding: 10,
    alignItems: 'flex-start'
    },
  title:{
      fontSize: 15,
      color: '#000',
      width: 70,
  },
  icon:{
    position: 'relative',
    top: 133,
    left: 50,
    zIndex: 2
  },
});



export default SmallCard
