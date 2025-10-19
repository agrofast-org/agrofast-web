"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useRouter } from "next/router";

const GoogleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ?? ""}>
      <APIProvider
        region="BR"
        language={router.locale ?? "pt-BR"}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_SERVER_KEY ?? ""}
        libraries={["places"]}
      >
        {children}
      </APIProvider>
    </GoogleOAuthProvider>
  );
};
export default GoogleProvider;
