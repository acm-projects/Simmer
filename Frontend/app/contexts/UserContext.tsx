import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { fetchUser } from '../api/userApi'

interface UserContextType {
  user: any | undefined;
  setUser: Dispatch<SetStateAction<any | undefined>>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: undefined,
  setUser: () => {},
  refreshUser: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}
interface UserProps {
  user: any | undefined;
  setUser: Dispatch<SetStateAction<any | undefined>>;
  refreshUser: () => Promise<void>;
  children: ReactNode;
}

export function UserProvider({user, setUser, refreshUser, children }: UserProps) {

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}
