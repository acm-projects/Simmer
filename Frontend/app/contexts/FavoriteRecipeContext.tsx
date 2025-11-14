import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';

interface FavoriteRecipeProps {
  favoriteRecipes: any[] | undefined;
  setFavoriteRecipes: Dispatch<SetStateAction<any[] | undefined>>;
  children: ReactNode;
}
interface FavoriteRecipeContextType {
  favoriteRecipes: any[] | undefined;
  setFavoriteRecipes: Dispatch<SetStateAction<any[] | undefined>>;
}
const FavoriteRecipeContext = createContext<FavoriteRecipeContextType>({favoriteRecipes:undefined,setFavoriteRecipes:()=>{}});

export function useFavoriteRecipes() {
  return useContext(FavoriteRecipeContext);
}

export function FavoriteRecipeProvider({favoriteRecipes, setFavoriteRecipes, children }: FavoriteRecipeProps) {
   

  return <FavoriteRecipeContext.Provider value={{favoriteRecipes, setFavoriteRecipes}}>{children}</FavoriteRecipeContext.Provider>;
}
