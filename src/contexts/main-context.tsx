import DebugOptions from "@/components/debug/debug-options";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { OverlayProvider } from "./overlay-provider";
import { LanguageProvider } from "./language-provider";
import { AuthProvider } from "./auth-provider";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import ToasterProvider from "./toast-provider";

interface MainProviderProps {
  children: React.ReactNode;
  pageProps: AppProps["pageProps"];
}

const MainProvider: React.FC<MainProviderProps> = ({ children, pageProps }) => {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      locale={router.locale ?? "pt-BR"}
      timeZone="America/Sao_Paulo"
      messages={pageProps.messages}
    >
      <HeroUIProvider>
        <ToasterProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <LanguageProvider>
              <OverlayProvider>
                <AuthProvider>
                  {children}
                  <DebugOptions />
                </AuthProvider>
              </OverlayProvider>
            </LanguageProvider>
          </NextThemesProvider>
        </ToasterProvider>
      </HeroUIProvider>
    </NextIntlClientProvider>
  );
};

export default MainProvider;
