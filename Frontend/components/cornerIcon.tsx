
import { StyleSheet, Text, View, Image } from 'react-native';
import { Link } from 'expo-router';
import { Menu } from 'lucide-react-native';
import { Search } from 'lucide-react-native';
import { Plus } from 'lucide-react-native';

const CornerIcon = () => {
  return (
    <View style={{flexDirection: "row"}}>
        <View style={styles.container}>
       
               <Link href="/screens/search">
                <Plus color='white'/>
               </Link>
        </View>
      <View style={styles.container}>
       
               <Link href="/screens/search">
                <Search color='white'/>
               </Link>
        </View>
        <View style={styles.container}>
               <Link href="/screens/settings">
                   <Menu color='white'/>
               </Link>
          </View>
      </View>
    
   
  )
}

const styles = StyleSheet.create({
container:{
    backgroundColor: '#9BA760',
    borderRadius: 100,
    padding: 4,
    margin: 2,
    height: 34,
    width: 34,
    justifyContent: 'center',
    alignItems: 'center'
},


});


export default CornerIcon

