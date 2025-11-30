"use client";

type defaultContextType = {
  user: UserType | null;
  token: string | null;
  logout: () => void;
  login: (token: string) => void;
};

const defaultContext: defaultContextType = {
  user: null,
  token: null,
  logout: () => {},
  login: () => {},
};

import { createContext, useState } from "react";
import { UserType } from "./types/user";

const AppContext = createContext<defaultContextType>(defaultContext);
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  });

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  };

  const setToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("Token", token);
      setTokenState(token);
    }
  };

  const login = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("Token", JSON.stringify(token));
      setToken(token);
    }
  };

  return (
    <AppContext.Provider value={{ user, token, logout, login }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
