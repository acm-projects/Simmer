import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSupabase } from "../contexts/SupabaseContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchCollections(token:string) {
  const res = await fetch(`${API_URL}user/collections`, {
    method: "GET",
    headers:{
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
  const data=await res.json();
  return data
}

export async function fetchUser(token:string) {
  const res = await fetch(`${API_URL}user`, {
    method: "GET",
    headers:{
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
  const data=await res.json();
  return data
}
