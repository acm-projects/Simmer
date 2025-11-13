import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';

interface SearchRecipeProps {
  searchRecipes: any[] | undefined;
  setSearchRecipes: Dispatch<SetStateAction<any[] | undefined>>;
  children: ReactNode;
}
interface SearchRecipeContextType {
  searchRecipes: any[] | undefined;
  setSearchRecipes: Dispatch<SetStateAction<any[] | undefined>>;
}
const SearchRecipeContext = createContext<SearchRecipeContextType>({searchRecipes:undefined,setSearchRecipes:()=>{}});

export function useSearchRecipes() {
  return useContext(SearchRecipeContext);
}

export function SearchRecipeProvider({searchRecipes, setSearchRecipes, children }: SearchRecipeProps) {
    

  return <SearchRecipeContext.Provider value={{searchRecipes, setSearchRecipes}}>{children}</SearchRecipeContext.Provider>;
}