
import { StyleSheet, Text, View, Image, ImageSourcePropType, } from 'react-native';
import FavoriteIcon from '@/components/favoriteIcon';
import { AlarmClock } from 'lucide-react-native'
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';
import { useFonts } from '@expo-google-fonts/nunito/useFonts';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';

interface Props{
  title: string;
  image: ImageSourcePropType; 
}

const LargeCard: React.FC<Props>= ({title, image}) => {

   let [fontsLoaded] = useFonts({
    Nunito_400Regular,
  });

  return (
    <Link href="../screens/description" style={styles.container}>
    <View style={styles.content}>
       
   
    <Image source={image} style={styles.image}/>
   
   <View style={styles.icon}>
         <Heart size={22} color="black"/>
         </View>
      <View style={styles.card}>
        
               <Text style={styles.title}>{title}</Text> 
                   <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                         <Text style={styles.time}>Time: 30 min </Text>       
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
    shadowOffset:{width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
      fontFamily: 'Nunito_400Regular',
  },
    icon:{
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 2
  },
  time:{
    fontSize: 13,
    marginLeft: 15,
    fontFamily: 'Nunito_400Regular'
  }
});



export default LargeCard

