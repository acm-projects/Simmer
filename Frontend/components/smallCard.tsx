
import { StyleSheet, Text, View, Image } from 'react-native';
import FavoriteIcon from '@/components/favoriteIcon';
import { AlarmClock } from 'lucide-react-native'


const SmallCard = () => {
  return (
    <View style={styles.container}>
       
      <View style={styles.imageCard}>
        
         <Image source={require('../assets/images/tacos.jpg')} style={styles.image}/>
         <View style={styles.icon}>
         <FavoriteIcon/>
         </View>
        
      </View>
      <View style={styles.card}>
        <Text style={styles.title}> Chicken Tacos</Text> 
        <View style={[styles.text, styles.row]}>
            <Text style={styles.left} >Spicy</Text>
            <AlarmClock size ={18} color="#000" style={{marginRight: -15}}/>
            <Text style={styles.right} >15 min</Text>
        </View>
    
       </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  image:{
    backgroundColor: 'white',
    width: 150,
    height: 150,
    borderRadius: 15,
    bottom: -6,
    zIndex: 1,
  },
  imageCard:{
    zIndex: 1,
    shadowColor: "#303030ff",
    shadowOffset:{width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 4,

    elevation: 4,
    alignItems: 'center',
  },
  card: {
    width: 147,
    height: 65,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  title:{
      fontSize: 16,
      color: '#06402B',
      paddingTop: 12,
      marginLeft: 3,
  },
  text: {
    marginTop: 1,
    fontSize: 12,
    color: '#333',
    padding: 4,
  },

    row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // pushes left/right
    width: '100%', // make sure it spans full width
  },
  left: {
    textAlign: 'left',
    marginLeft: 5,
  },
  right: {
    textAlign: 'right',
    marginRight: 5,
  },
  icon:{
    position: 'absolute',
    top: 10,
    right: 5,
    zIndex: 2
  },
});



export default SmallCard
