import React from "react";
import { View, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import SmallCard from "../components/smallCard";
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
];

export default function MyCarousel() {
  return (
    <View style={{ flex: 1 }}>
      <Carousel

  loop
  width={width}
  height={220}
  data={data}
  renderItem={({ item }: { item: CarouselItem }) => (
    <SmallCard title={item.title} image={item.image} />
  )}
/>

    </View>
  );
}

