import React, { createContext, useContext, useState, useEffect , ReactNode, Dispatch, SetStateAction } from 'react';
import { fetchUser } from '../api/userApi';

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

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | undefined>(undefined);

  const refreshUser = async () => {
    try {
      const data = await fetchUser();
      setUser(data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}