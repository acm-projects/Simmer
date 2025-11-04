import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { User } from 'lucide-react-native';
import { LogOut } from 'lucide-react-native';
import { ChevronRight } from 'lucide-react-native';
import { Link, router } from 'expo-router';
import { useSupabase } from '../contexts/SupabaseContext';



export default function SettingScreen() {
  const supabase=useSupabase();
  const logout=async ()=>{
    console.log('logout')
    const { error } = await supabase.auth.signOut();
  }
  return (
<ScrollView style={styles.container}>
  <View>
    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.title}>Settings</Text>
        </View>
   
   
        <TouchableOpacity onPress={() => router.back()}>
        <ArrowLeft size={20} style={styles.arrow}/>
        </TouchableOpacity>

<View style={{paddingTop: 50}}>
    <Link href='./profilePage' style={{width: '100%'}}>
      <View style={styles.info}>
      <User color={'#9BA760'}/>
     <Text style={styles.text}>Profile</Text>
     <ChevronRight color={'#9BA760'} style={{position: 'relative', right: '-160%'}}/>
     </View>
     </Link>

     
     <View style={styles.info}>
     <LogOut color={'#9BA760'}/>
     <TouchableOpacity onPress={logout}>
     <Text style={styles.text}>Log Out</Text>
     </TouchableOpacity>
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
    backgroundColor: '#f5ebe6ff',
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
    fontFamily: 'Nunito_400Regular',
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
    padding: 5,
    color: 'red',
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Nunito_700Bold',
  },
});
