import React from 'react';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

import LargeCard from "@/components/largeCard";

export default function RecipeScreen() {
  const router = useRouter(); // 👈 for navigation control

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.arrowContainer}>
        <ArrowLeft size={24} color="#9BA760" />
      </TouchableOpacity>

      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
        <Text style={styles.title}>Collection Name</Text>
      </View>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.text}>11 Recipes</Text>

        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
        <LargeCard title="Chicken Tacos" image={require('../../assets/images/tacos.jpg')} />
      </View>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5ebe6ff',
    paddingTop: 50,
  },
  title: {
    fontSize: 25,
    color: '#9BA760',
    fontFamily: 'Nunito_700Bold',
  },
  text: {
    fontSize: 16,
    paddingLeft: 25,
    paddingBottom: 5,
    fontFamily: 'Nunito_400Regular',
  },
  arrowContainer: {
    position: 'absolute',
    top: 15,
    left: 25,
    zIndex: 10,
  },
});
