import { useState, useCallback } from "react";
import mapsApi from "@/service/routes-api";

const useRouteDisclosure = () => {
  const [placeFrom, setPlaceFrom] = useState<google.maps.places.Place | null>(
    null
  );
  const [placeTo, setPlaceTo] = useState<google.maps.places.Place | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [route, setRoute] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRoute = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (routeOptions?: any) => {
      if (!placeFrom || !placeTo) return;
      setIsLoading(true);
      try {
        const res = await mapsApi.computeRoutes(
          {
            lat: (placeFrom.location as google.maps.LatLng).lat(),
            lng: (placeFrom.location as google.maps.LatLng).lng(),
          },
          {
            lat: (placeTo.location as google.maps.LatLng).lat(),
            lng: (placeTo.location as google.maps.LatLng).lng(),
          },
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
