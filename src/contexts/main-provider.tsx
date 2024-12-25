import DebugOptions from "@/components/debug/debug-options";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface MainProviderProps {
  children: React.ReactNode;
}

const MainProvider: React.FC<MainProviderProps> = ({ children }) => {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <div>
          {children}
          <DebugOptions />
        </div>
      </NextThemesProvider>
    </NextUIProvider>
  );
};

export default MainProvider;
