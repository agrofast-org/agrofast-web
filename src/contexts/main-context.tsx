import DebugOptions from "@/components/debug/debug-options";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import ToasterProvider from "./toast-provider";

interface MainProviderProps {
  children: React.ReactNode;
}

const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <ToasterProvider>
          {children}
          <DebugOptions />
        </ToasterProvider>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default MainProvider;
