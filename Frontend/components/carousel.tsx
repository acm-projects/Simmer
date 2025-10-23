import React from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import SmallCard from "../components/smallCard";
import LargeCard from "../components/largeCard";
import { ImageSourcePropType } from "react-native";

const { width } = Dimensions.get("window");

type CarouselItem = {
  id: number;
  title: string;
  image: ImageSourcePropType;
};

const data: CarouselItem[] = [
  { id: 1, title: "Chicken Tacos", image: require("../assets/images/tacos.jpg") },
  { id: 2, title: "Chicken Tacos", image: require("../assets/images/tacos.jpg") },
  { id: 3, title: "Chicken Tacos", image: require("../assets/images/tacos.jpg") },
  { id: 4, title: "Chicken Tacos", image: require("../assets/images/tacos.jpg") },
];

export default function MyCarousel() {
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
        height={220}
        data={pairedData}
        renderItem={({ item }: { item: CarouselItem[] }) => (
          <View style={{ 
            flexDirection: 'row', 
            width: width, 
            justifyContent: 'space-around',
            paddingHorizontal: 10 
          }}>
            <SmallCard title={item[0].title} image={item[0].image} />
            {item[1] && <SmallCard title={item[1].title} image={item[1].image} />}
          </View>
        )}
      />
    </View>
  );
}