import type { useTranslations } from "next-intl";
import React, { createContext, useContext, ReactNode, useState } from "react";

export type TranslationKey = Parameters<ReturnType<typeof useTranslations>["raw"]>[0];

interface OverlayContextProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  isPageLoading: boolean;
  setIsPageLoading: (isPageLoading: boolean) => void;
  message: TranslationKey | undefined;
  setMessage: (message: TranslationKey | undefined) => void;
  pageMessage: TranslationKey | undefined;
  setPageMessage: (pageMessage: TranslationKey | undefined) => void;
}

const OverlayContext = createContext<OverlayContextProps | undefined>(
  undefined
);

export const useOverlay = (): OverlayContextProps => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error("useOverlay must be used within a OverlayProvider");
  }
  return context;
};


export const OverlayProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const t = useTranslations();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<TranslationKey | undefined>();
  const [pageMessage, setPageMessage] = useState<TranslationKey | undefined>("Messages.info.loading");

  return (
    <OverlayContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isPageLoading,
        setIsPageLoading,
        message,
        setMessage,
        pageMessage,
        setPageMessage,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};
