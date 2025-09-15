import { AppProps } from "next/app";
import { ClientSideProviders } from "./client-side-providers";
import { ServerSideProviders } from "./server-side-providers";

export interface AppProvidersProps {
  children: React.ReactNode;
  pageProps: AppProps["pageProps"];
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children, pageProps }) => {
  return (
    <>
      <ServerSideProviders>
        <ClientSideProviders pageProps={pageProps}>{children}</ClientSideProviders>
      </ServerSideProviders>
    </>
  );
};
