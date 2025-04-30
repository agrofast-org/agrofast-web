import {
  GoogleMap,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useEffect, useState, useCallback, useMemo } from "react";

const mapContainerStyle = { width: "100%", height: "100%" };

export interface RouteMapProps {
  from: google.maps.LatLngLiteral | null;
  to: google.maps.LatLngLiteral | null;
}

export const RouteMap: React.FC<RouteMapProps> = ({ from, to }) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [currentPos, setCurrentPos] = useState<google.maps.LatLngLiteral>();
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setCurrentPos({ lat: coords.latitude, lng: coords.longitude });
      map?.panTo({ lat: coords.latitude, lng: coords.longitude });
    });
  }, [map]);

  const directionsCallback = useCallback(
    (result: google.maps.DirectionsResult | null, status: string) => {
      if (status === "OK" && result) setDirections(result);
    },
    []
  );

  const directionsRequest = useMemo<google.maps.DirectionsRequest>(
    () => ({
      origin: from!,
      destination: to!,
      travelMode: google.maps.TravelMode.DRIVING,
    }),
    [from, to]
  );

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
      disableDefaultUI: false,
    }),
    []
  );

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={currentPos || { lat: -14.235, lng: -51.9253 }}
      zoom={currentPos ? 12 : 4}
      onLoad={setMap}
      options={mapOptions}
    >
      {currentPos && <Marker position={currentPos} title="Você está aqui" />}
      {!directions && from && <Marker position={from} title="Origem" />}
      {!directions && to && <Marker position={to} title="Destino" />}

      {from && to && (
        <DirectionsService
          options={directionsRequest}
          callback={directionsCallback}
        />
      )}
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  );
};
