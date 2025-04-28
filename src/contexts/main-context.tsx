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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BrowserAgentProvider from "./browser-agent-provider";
import CookieUseWarning from "@/components/ui/cookie-use-warning";
import SolarIconsProvider from "./solar-icons-provider";
import { LoadScript } from "@react-google-maps/api";

interface MainProviderProps {
  children: React.ReactNode;
  pageProps: AppProps["pageProps"];
}

const queryClient = new QueryClient();

const MainProvider: React.FC<MainProviderProps> = ({ children, pageProps }) => {
  const router = useRouter();  

  console.log(process.env.NEXT_PUBLIC_GOOGLE_MAPS_SERVER_KEY);
  

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider
        locale={router.locale ?? "pt-BR"}
        timeZone="America/Sao_Paulo"
        messages={pageProps.messages}
      >
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_SERVER_KEY ?? ""}
          libraries={["places"]}
        >
          <SolarIconsProvider>
            <HeroUIProvider>
              <CookieUseWarning />
              <ToasterProvider>
                <NextThemesProvider attribute="class" defaultTheme="light">
                  <LanguageProvider>
                    <OverlayProvider>
                      <BrowserAgentProvider>
                        <AuthProvider>
                          {children}
                          <DebugOptions />
                        </AuthProvider>
                      </BrowserAgentProvider>
                    </OverlayProvider>
                  </LanguageProvider>
                </NextThemesProvider>
              </ToasterProvider>
            </HeroUIProvider>
          </SolarIconsProvider>
        </LoadScript>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

export default MainProvider;
