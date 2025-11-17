import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';
import { fetchCollections } from '../_api/userApi';

interface CollectionProps {
  collections: any[] | undefined;
  setCollections: Dispatch<SetStateAction<any[] | undefined>>;
  children: ReactNode;
}
interface CollectionContextType {
  collections: any[] | undefined;
  setCollections: Dispatch<SetStateAction<any[] | undefined>>;
  refreshCollections: () => Promise<void>;
}
const CollectionContext = createContext<CollectionContextType>({
  collections:undefined,
  setCollections:() => {},
  refreshCollections: async () => {},
});

export function useCollection() {
  return useContext(CollectionContext);
}

export function CollectionProvider({collections, setCollections, children }: CollectionProps) {

  const refreshCollections = async (token:string) => {
    try {
      const data = await fetchCollections(token);
      setCollections(data.collections);
    } catch (error) {
      console.error('Failed to refresh collections: ', error);
    }
  }
   
  return <CollectionContext.Provider value={{collections, setCollections, refreshCollections }}>{children}</CollectionContext.Provider>;
}
