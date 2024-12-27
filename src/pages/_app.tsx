import MainProvider from "@/contexts/main-context";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      locale={router.locale ?? "pt-BR"}
      timeZone="America/Sao_Paulo"
      messages={pageProps.messages}
    >
      <MainProvider>
        <Component {...pageProps} />
      </MainProvider>
    </NextIntlClientProvider>
  );
};

export default App;
