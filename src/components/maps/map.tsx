import {
  Map as GoogleMap,
  MapProps as GoogleMapProps,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";

export interface MapProps extends GoogleMapProps {
  children?: React.ReactNode;
}

export const containerStyle = { width: "100%", height: "100%" };
export const initialCenter = { lat: -15.7213, lng: -48.0197 };

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
