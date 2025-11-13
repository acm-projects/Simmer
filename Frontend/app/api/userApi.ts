import { useSupabase } from '../contexts/SupabaseContext';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL
const supabase = useSupabase()

async function authHeaders() {
const { data: { session }, error } = await supabase.auth.getSession();
  const token = session?.access_token;
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };
}

export async function fetchUser() {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/user`, { headers });

  if (!res.ok) throw new Error(`Failed to fetch user: ${res.status}`);
  return res.json();
}

export async function updateUserName(first_name: string, last_name: string) {
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/user/update-name`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ first_name, last_name }),
  });

  if (!res.ok) throw new Error("Failed to update user name");
  return res.json();
}

export async function updateUserAllergens(allergens: string[]) {
    console.log('laskdfksflksdjflskjfadfdf')
    console.log(typeof allergens);
  const headers = await authHeaders();
  const res = await fetch(`${BASE_URL}/user/dietary-restrictions`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ diet_restriction : allergens }),
  });

  if (!res.ok) throw new Error("Failed to update dietary restrictions");
  return res.json();
}