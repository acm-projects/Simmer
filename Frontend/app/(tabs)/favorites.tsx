import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';


import CollectionCard from "@/components/collectionCard";
import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function FavoritesScreen() {
 return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
     <Text style={styles.text}>Favorites</Text>
     </View>


     <View>
     <FontAwesome6 name="arrow-left" size={20} style={styles.arrow}/>
     </View>


     <View style={{ justifyContent: 'center', alignItems: 'center'}}>
       <CollectionCard />
       <CollectionCard />
     </View>


     <View style={styles.bubble}>
       <Text style={styles.bubbleText}>+ Create Collection</Text>
     </View>




    </ScrollView>
 );
}


const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor: '#fce6dbff',
 },
 content: {
   padding: 1,
   top: 50,
 },
 text: {
   fontSize: 25,
   color: '#9BA760',
 },
 bubble: {
   backgroundColor: '#9BA760',
   padding: 12,
   borderRadius: 16,
   maxWidth: "80%",
   marginVertical: 10,
   alignSelf: "center",
 },
 bubbleText: {
   fontSize: 16,
   color: "white",
   textAlign: "center",
 },
 arrow: {
   color: "#9BA760",
   position: "absolute",
   left: 25,
   top: -25,
 },
});



