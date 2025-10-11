import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Orbitron_400Regular, Orbitron_700Bold} from '@expo-google-fonts/orbitron'

export default function SettingScreen() {
    let [fontsLoaded] = useFonts({
        Orbitron_400Regular,
        Orbitron_700Bold // Add all desired font styles here
      });
 
  
  return (
    <ScrollView style={styles.container}>
  <View style={{flexDirection: 'row', alignItems: 'center'}}>

     
     <ArrowLeft  size={20} style={{margin: 5, }}/>
     

     <View style={{backgroundColor: '#ffff', borderRadius: 100, width: '80%', marginLeft: 10, }}>
        <View style={{backgroundColor: '#262e05ff', width: '30%', borderRadius: 100,}}>
            <Text> </Text>
        </View>
     </View>

    
    
  </View>
   <View style={{alignItems: 'center',  bottom: -440}}>
        <Text style={styles.customText}>2:59</Text>
    </View>
</ScrollView>
  )

}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#9BA760',
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
    padding: 10,
  },
     delete:{
    fontSize: 15,
    paddingLeft: 15,
    padding: 8,
    color: 'red'
  },
    arrow: {
        color: "#ffffff",
    },
     title:{
    paddingLeft: 15,
    paddingTop: 15,
    fontSize: 25,
    color: '#9BA760',
  },
  customText:{
    fontFamily: 'Orbitron_400Regular',
    fontSize: 80,
  }
});
