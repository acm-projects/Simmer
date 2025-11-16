import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSupabase } from "../contexts/SupabaseContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;



// export async function updateName(first_name: string, last_name: string) {
//   const res = await fetch(`${API_URL}/user/update-name`, {
//     method: "PUT",
//     headers: await authHeaders(),
//     body: JSON.stringify({ first_name, last_name }),
//   });
//   return res.json();
// }

// export async function updateEmail(email: string) {
//   const res = await fetch(`${API_URL}/user/update-email`, {
//     method: "PUT",
//     headers: await authHeaders(),
//     body: JSON.stringify({ email }),
//   });
//   return res.json();
// }

// export async function updateDietaryRestrictions(restrictions: string[]) {
//   const res = await fetch(`${API_URL}/user/dietary-restrictions`, {
//     method: "PUT",
//     headers: await authHeaders(),
//     body: JSON.stringify({ diet_restriction: restrictions }),
//   });
//   return res.json();
// }

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
