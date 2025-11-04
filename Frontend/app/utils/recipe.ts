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
        //console.log(data.result)
        setRecipes(data.result)
      } catch (err) {
        console.error( err);
        alert("Could not connect to server");
      }
    }