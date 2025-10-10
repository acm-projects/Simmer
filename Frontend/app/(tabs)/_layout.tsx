import { Tabs } from 'expo-router';


import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Heart } from 'lucide-react-native';
import { Layers } from 'lucide-react-native';




export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'white',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle:{
          backgroundColor: '#9BA760',
          height: 57,
          borderTopWidth: 0,
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
