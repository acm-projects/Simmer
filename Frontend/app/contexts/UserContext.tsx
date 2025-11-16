import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';
import { fetchUser } from '../api/userApi';

interface UserContextType {
  user: any | undefined;
  setUser: Dispatch<SetStateAction<any | undefined>>;
  refreshUser: () => Promise<void>;
}
interface UserContextProp {
  user: any | undefined;
  setUser: Dispatch<SetStateAction<any | undefined>>;
  children:ReactNode
}

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  refreshUser: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({user,setUser, children }: UserContextProp) {

  const refreshUser = async (token:string) => {
    try {
      const data = await fetchUser(token);
      setUser(data.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  // useEffect(() => {
  //   refreshUser();
  // }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}