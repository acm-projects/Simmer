import { Image } from "expo-image";
import { Dispatch, SetStateAction } from "react";

export const getRecipes=async(jwt:string|undefined, setRecipes:Dispatch<SetStateAction<any[] | undefined>>)=>{
      try{
        const response =  await fetch(`${process.env.EXPO_PUBLIC_API_URL}recipes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
          }
        });
        const data=await response.json()
        for(const recipe of data.result){
          console.log(recipe.image_url)
          await Image.prefetch(recipe.image_url);
        }
        //console.log(data.result)
        setRecipes(data.result)
      } catch (err) {
        console.error( err);
        alert("Could not connect to server");
      }
    }

export const getCollections=async(jwt:string|undefined, setCollections:Dispatch<SetStateAction<any[] | undefined>>)=>{
      try{
        const response =  await fetch(`${process.env.EXPO_PUBLIC_API_URL}user/collections`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${jwt}`
          }
        });
        const data=await response.json()
        console.log('ddddddddddg')
        console.log(data.collections)
        for(const collection of data.collections){
          if(collection.image_url) {
            console.log(collection.image_url)
            await Image.prefetch(collection.image_url);
          }
        }
        setCollections(data.collections)
      } catch (err) {
        console.error( err);
        alert("Could not connect to server");
      }
    }