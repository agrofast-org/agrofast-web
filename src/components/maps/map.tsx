import {
  Map as GoogleMap,
  MapProps as GoogleMapProps,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";

export interface MapProps extends GoogleMapProps {
  children?: React.ReactNode;
}

const containerStyle = { width: "100%", height: "100%" };
const initialCenter = { lat: -14.235, lng: -51.9253 };

const Map: React.FC<MapProps> = ({ children, ...props }) => {
  const {theme} = useTheme();
  
  return (
    <GoogleMap
      style={containerStyle}
      defaultCenter={initialCenter}
      defaultZoom={5}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl={false}
      clickableIcons={false}
      disableDefaultUI={false}
      mapId={"default"}
      colorScheme={theme === "dark" ? "DARK" : "LIGHT"}
      {...props}
    >
      {children}
    </GoogleMap>
  );
};

export default Map;
