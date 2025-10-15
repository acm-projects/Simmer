import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { User } from 'lucide-react-native';
import { LogOut } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';



export default function SettingScreen() {
  return (
<ScrollView style={styles.container}>
  <View>
    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.title}>Settings</Text>
        </View>
   
   
        <View>
        <ArrowLeft size={20} style={styles.arrow}/>
        </View>

<View style={{paddingTop: 50}}>
    <View style={styles.info}>
      
      <User />
     <Text style={styles.text}>Profile</Text>
     <ChevronRight style={{position: 'absolute', right: 20}}/>
     </View>
     <View style={styles.info}>
     <LogOut/>
     <Text style={styles.text}>Log Out</Text>
     <ChevronRight style={{position: 'absolute', right: 20}}/>
      </View>
     <Text style={styles.delete}>Delete Account</Text>
    </View>
     
  </View>
</ScrollView>
  )

}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#f1e2dbff',
    paddingTop: 70,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
     delete:{
    fontSize: 15,
    paddingLeft: 25,
    padding: 10,
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
