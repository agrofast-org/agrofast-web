"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AppContextProps {
  query: Record<string, string | number>;
  mounted: boolean;
  headerVisible: boolean;
  setHeaderVisible: (visible: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [query, setQuery] = useState<Record<string, string | number>>({});
  const [headerVisible, setHeaderVisible] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const queryData = new URLSearchParams(window.location.search);
    queryData.forEach((value, key) => {
      const field = document.querySelector(
        `[name="${key}"][data-query-collectable="true"]`
      );
      if (field) {
        setQuery((prev) => ({
          ...prev,
          [key]: value,
        }));
      }
    });
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppContext.Provider
      value={{ query, mounted, headerVisible, setHeaderVisible }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
