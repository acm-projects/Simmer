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
        backgroundColor: "#f5ebe6ff",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Create a new collection</Text>
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
}