import { useState, useCallback } from "react";
import mapsApi from "@/service/routes-api";

export const getLocation = (
  place?: google.maps.places.Place | google.maps.places.PlaceResult
): google.maps.LatLngLiteral | null => {
  if (place) {
    if ("location" in place && place.location) {
      const lat = place.location.lat();
      const lng = place.location.lng();
      if (lat !== undefined && lng !== undefined) {
        return { lat, lng };
      }
    }
    if ("geometry" in place && place.geometry && place.geometry.location) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      if (lat !== undefined && lng !== undefined) {
        return { lat, lng };
      }
    }
  }
  return null;
};

const useRouteDisclosure = () => {
  const [placeFrom, setPlaceFrom] = useState<
    google.maps.places.Place | google.maps.places.PlaceResult | null
  >(null);
  const [placeTo, setPlaceTo] = useState<
    google.maps.places.Place | google.maps.places.PlaceResult | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [route, setRoute] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRoute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (routeOptions?: any) => {
      if (!placeFrom || !placeTo) return;
      setIsLoading(true);
      try {
        const fromCoords = getLocation(placeFrom);
        const toCoords = getLocation(placeTo);
        if (!fromCoords || !toCoords) {
          throw new Error("Invalid coordinates for route computation.");
        }
        const res = await mapsApi.computeRoutes(
          fromCoords,
          toCoords,
          routeOptions
        );
        const [computedRoute] = res.routes;
        setRoute(computedRoute);
      } catch (error) {
        console.error("Error fetching route:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [placeFrom, placeTo]
  );

  const reset = useCallback(() => {
    setPlaceFrom(null);
    setPlaceTo(null);
    setRoute(null);
    setIsLoading(false);
  }, []);

  return {
    placeFrom,
    setPlaceFrom,
    placeTo,
    setPlaceTo,
    route,
    setRoute,
    isLoading,
    fetchRoute,
    reset,
  };
};

export default useRouteDisclosure;
