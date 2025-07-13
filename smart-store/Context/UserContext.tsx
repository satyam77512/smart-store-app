import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  name: string;
  username:string;
  isLoggedIn: boolean;
  login: (name: string,Username:string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedName && storedUsername) {
        setName(storedName);
        setUsername(storedUsername);
        setIsLoggedIn(true);
      }
    };
    loadUser();
  }, []);

  const login = async (name: string, Username:string) => {
    setName(name);
    setUsername(Username);
    setIsLoggedIn(true);
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('username',Username);
  };

  const logout = async () => {
    setName('');
    setUsername('');
    setIsLoggedIn(false);
    await AsyncStorage.removeItem('name');
    await AsyncStorage.removeItem('username');
  };

  return (
    <UserContext.Provider value={{ name,username,isLoggedIn,login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
