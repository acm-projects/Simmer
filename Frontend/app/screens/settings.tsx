import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function SettingScreen() {
  return (
<ScrollView style={styles.container}>
  <View>
     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.title}>Settings</Text>
     </View>


     <View>
     <FontAwesome6 name="arrow-left" size={20} style={styles.arrow}/>
     </View>
     <Text style={styles.text}>Profile</Text>
     <Text style={styles.info}>Name</Text>
     <Text style={styles.info}>Email</Text>
     <Text style={styles.info}>Allergens</Text>
     <Text style={styles.text}>Log Out</Text>
     <Text style={styles.delete}>Delete Account</Text>
  </View>
</ScrollView>
  )

}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fce6dbff',
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    
  },
  content:{
    padding: 1,
    top: 1,
  },
    text:{
    fontSize: 18,
    paddingLeft: 15,
    padding: 10,
  },
    info:{
    fontSize: 18,
    paddingLeft: 25,
    padding: 10,
  },
     delete:{
    fontSize: 15,
    paddingLeft: 15,
    padding: 8,
    color: 'red'
  },
    arrow: {
        color: "#9BA760",
        position: "absolute",
        left: 25,
        top: -25,
    },
     title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
});
