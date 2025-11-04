import React from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import SmallCard from "../components/smallCard";
import { ImageSourcePropType } from "react-native";
import { useRecipes } from "../app/contexts/RecipeContext";

const { width } = Dimensions.get("window");

type CarouselItem = {
  id: string;
  title: string;
  image: ImageSourcePropType;
};




export default function MyCarousel() {
  const {recipes}=useRecipes();
  const favoriteRecipes=recipes?recipes?.filter((recipe)=>recipe.user_favorites.length>0):[]
  const data: CarouselItem[] = favoriteRecipes?.map((recipe:any)=>({id:recipe.id,title:recipe.title,image:recipe.image_url}))
  // Transform data into pairs
  const pairedData = data.reduce((acc: CarouselItem[][], item: CarouselItem, index: number) => {
    if (index % 2 === 0) {
      acc.push([item]);
    } else {
      acc[acc.length - 1].push(item);
    }
    return acc;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Carousel
        loop
        width={width}
        height={225}
        data={pairedData}
        renderItem={({ item }: { item: CarouselItem[] }) => (
          <View style={{ 
            flexDirection: 'row', 
            width: width, 
            justifyContent: 'space-around',
            paddingHorizontal: 10,
            alignContent: 'center',
        
            
          }}>
            <SmallCard title={item[0].title} image={item[0].image} id={item[0].id} />
            {item[1] && <SmallCard title={item[1].title} image={item[1].image} id={item[0].id} />}
          </View>
        )}
      />
    </View>
  );
}