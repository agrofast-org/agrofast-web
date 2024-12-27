import useLocalStorage from "@/lib/useLocalstorage";
import { useRouter } from "next/router";
import React, { createContext, useContext, ReactNode, useEffect } from "react";

type Language = "pt-BR" | "en" | "es";

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(
  undefined
);

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [language, setLanguage] = useLocalStorage<Language>(
    "language",
    "pt-BR"
  );

  useEffect(() => {
    router.push(router.pathname, undefined, { locale: language });
  }, [router, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
