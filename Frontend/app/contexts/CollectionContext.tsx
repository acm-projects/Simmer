import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';

interface CollectionProps {
  collections: any[] | undefined;
  setCollections: Dispatch<SetStateAction<any[] | undefined>>;
  children: ReactNode;
}
interface CollectionContextType {
  collections: any[] | undefined;
  setCollections: Dispatch<SetStateAction<any[] | undefined>>;
}
const CollectionContext = createContext<CollectionContextType>({collections:undefined,setCollections:()=>{}});

export function useCollection() {
  return useContext(CollectionContext);
}

export function CollectionProvider({collections, setCollections, children }: CollectionProps) {
   

  return <CollectionContext.Provider value={{collections, setCollections}}>{children}</CollectionContext.Provider>;
}
