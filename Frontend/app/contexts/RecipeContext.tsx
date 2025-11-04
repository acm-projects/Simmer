import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';

interface RecipeProps {
  recipes: any[] | undefined;
  setRecipes: Dispatch<SetStateAction<any[] | undefined>>;
  children: ReactNode;
}
interface RecipeContextType {
  recipes: any[] | undefined;
  setRecipes: Dispatch<SetStateAction<any[] | undefined>>;
}
const RecipeContext = createContext<RecipeContextType>({recipes:undefined,setRecipes:()=>{}});

export function useRecipes() {
  return useContext(RecipeContext);
}

export function RecipeProvider({recipes, setRecipes, children }: RecipeProps) {
   

  return <RecipeContext.Provider value={{recipes, setRecipes}}>{children}</RecipeContext.Provider>;
}
