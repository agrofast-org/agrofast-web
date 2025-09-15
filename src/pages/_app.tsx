import { AppProviders } from "@/contexts/app-providers";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <AppProviders pageProps={pageProps}>
      <Component {...pageProps} />
    </AppProviders>
  );
};

export default App;
