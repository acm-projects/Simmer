// SOME BS NEEDED FOR THE APP TO GO STRAIGHT TO THE HOMEPAGE, I STILL DON'T KNOW WHY THIS IS NEEDED, WHAT AM I EVEN DOING
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/homepage" />;
}
