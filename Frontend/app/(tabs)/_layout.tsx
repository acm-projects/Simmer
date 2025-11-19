import { Tabs } from 'expo-router';


import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Heart } from 'lucide-react-native';
import { Layers } from 'lucide-react-native';
import { useFonts } from '@expo-google-fonts/nunito/useFonts';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Dimensions } from 'react-native';





export default function TabLayout() {
  const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

    if (!fontsLoaded) {
    return null; // 👈 waits quietly
  }
  const screenWidth = Dimensions.get('window').width;
  const navBarWidth = 350;

  // Calculate the required left offset to center the bar
  const horizontalOffset = (screenWidth - navBarWidth) / 2;


  return (

    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        sceneStyle:{backgroundColor: 'f5ebe6ff'},
        tabBarInactiveTintColor: 'white',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle:{
          backgroundColor: '#9BA760',
          height: 50,
          width: 350,
          borderTopWidth: 0,
          borderRadius: 15,
          marginHorizontal: horizontalOffset,
          // left: 80,
          // right: 0,
          // alignSelf: 'stretch',
          bottom: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
          position: 'absolute',
          paddingBottom: 20,
          // marginLeft: 22,
        
        },
      }}>

      <Tabs.Screen
        name="homepage"
        options={{
          title: '',
          tabBarIconStyle: {marginTop: 5},
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      <Tabs.Screen
        name="recipes"
        options={{
          title: '',
          tabBarIconStyle: {marginTop: 5},
          tabBarIcon: ({ color }) => <Layers size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: '',
          tabBarIconStyle: {marginTop: 5},
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
    </Tabs>
    
  );
}
