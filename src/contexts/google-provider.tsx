import { APIProvider } from "@vis.gl/react-google-maps";

const GoogleProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_SERVER_KEY ?? ""}
      libraries={["places"]}
    >
      {children}
    </APIProvider>
  );
};
export default GoogleProvider;
