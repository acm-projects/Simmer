import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';

interface UserProps {
  user: any | undefined;
  setUser: Dispatch<SetStateAction<any | undefined>>;
  children: ReactNode;
}
interface UserContextType {
  user: any | undefined;
  setUser: Dispatch<SetStateAction<any | undefined>>;
}
const UserContext = createContext<UserContextType>({user:undefined,setUser:()=>{}});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({user, setUser, children }: UserProps) {
   

  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
}
