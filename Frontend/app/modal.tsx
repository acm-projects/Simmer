import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function CreateCollectionModal() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Create a new collection</Text>
      {/* Add your form or UI here */}
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}