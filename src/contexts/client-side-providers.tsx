"use client";
import { HeroUIProvider } from "@heroui/react";
import DebugOptions from "@/components/debug/debug-options";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { OverlayProvider } from "./overlay-provider";
import { LanguageProvider } from "./language-provider";
import { AuthProvider } from "./auth-provider";
import { NextIntlClientProvider } from "next-intl";
import ToasterProvider from "./toast-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BrowserAgentProvider from "./browser-agent-provider";
import CookieUseWarning from "@/components/ui/cookie-use-warning";
import SolarIconsProvider from "./solar-icons-provider";
import GoogleProvider from "./google-provider";
import { AppProps } from "next/app";
import { AppProvider } from "./app-context";

export interface ClientSideProvidersProps {
  children: React.ReactNode;
  pageProps: AppProps["pageProps"];
}

const queryClient = new QueryClient();

export const ClientSideProviders: React.FC<ClientSideProvidersProps> = ({
  children,
  pageProps,
}) => {
  // const router = useRouter();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider
          // locale={router.locale ?? "pt-BR"}
          locale="pt-BR"
          timeZone="America/Sao_Paulo"
          messages={pageProps.messages}
        >
          <GoogleProvider>
            <SolarIconsProvider>
              <HeroUIProvider
                skipFramerMotionAnimations={true}
                reducedMotion="user"
                // locale={router.locale ?? "pt-BR"}
                locale="pt-BR"
              >
                <AppProvider>
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
                </AppProvider>
              </HeroUIProvider>
            </SolarIconsProvider>
          </GoogleProvider>
        </NextIntlClientProvider>
      </QueryClientProvider>
    </>
  );
};
