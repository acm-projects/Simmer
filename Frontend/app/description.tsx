import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function DescriptionPage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} /> 

      <View style={styles.container}>
        <Text style={styles.title}>Details Page</Text>
        <Text>Content goes here.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#fce6dbff',
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});