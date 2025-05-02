import {
  AdvancedMarker,
  AdvancedMarkerAnchorPoint,
  useMap,
} from "@vis.gl/react-google-maps";
import Map from "./maps/map";
import Marker from "./maps/marker";
import { Pin, User } from "@solar-icons/react";
import { useEffect, useState } from "react";
import mapsApi from "@/service/routes-api";
import { Polyline } from "./maps/polyline";
import { getLocation } from "@/hooks/use-route-disclosure";

export interface RouteMapProps {
  from?: google.maps.places.Place | google.maps.places.PlaceResult | null;
  to?: google.maps.places.Place | google.maps.places.PlaceResult | null;
}

export const defaultAppearance = {
  walkingPolylineColor: "var(--map-walking-color)",
  defaultPolylineColor: "var(--map-default-color)",
  stepMarkerFillColor: "var(--map-marker-fill)",
  stepMarkerBorderColor: "var(--map-marker-border)",
};

const routeOptions = {
  travelMode: "DRIVE",
  computeAlternativeRoutes: false,
  units: "METRIC",
};

export const RouteMap: React.FC<RouteMapProps> = ({ from, to }) => {
  const map = useMap("route-map");

  const [route, setRoute] = useState<google.maps.DirectionsRoute | null>(null);

  useEffect(() => {
    if (map && (from || to)) {
      const bounds = new google.maps.LatLngBounds();
      const fromCoords = getLocation(from ?? undefined);
      const toCoords = getLocation(to ?? undefined);
      if (fromCoords) {
        bounds.extend(fromCoords);
      }
      if (toCoords) {
        bounds.extend(toCoords);
      }
      map.fitBounds(bounds);
    }
  }, [from, to, map]);

  useEffect(() => {
    if (!map) return;

    const fromCoords = getLocation(from ?? undefined);
    const toCoords = getLocation(to ?? undefined);
    if (fromCoords && toCoords) {
      mapsApi.computeRoutes(fromCoords, toCoords, routeOptions).then((res) => {
        const [route] = res.routes;

        setRoute(route);

        const { high, low } = route.viewport;
        const bounds: google.maps.LatLngBoundsLiteral = {
          north: high.latitude,
          south: low.latitude,
          east: high.longitude,
          west: low.longitude,
        };

        map.fitBounds(bounds);
      });
    }
  }, [from, to, map]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routeSteps: any[] = route?.legs[0].steps || [];

  const appearance = { ...defaultAppearance };

  const polylines = routeSteps.map((step, index) => {

    return (
      <Polyline
        key={`${index}-polyline`}
        encodedPath={step.polyline.encodedPolyline}
        strokeWeight={5}
        strokeColor="#3a6fe3e3"
      />
    );
  });

  const stepMarkerStyle = {
    backgroundColor: appearance.stepMarkerFillColor,
    borderColor: appearance.stepMarkerBorderColor,
    width: 8,
    height: 8,
    border: `1px solid`,
    borderRadius: "50%",
  };

  const stepMarkers = routeSteps.slice(1).map((step, index) => {
    const position = {
      lat: step.startLocation.latLng.latitude,
      lng: step.startLocation.latLng.longitude,
    };

    return (
      <AdvancedMarker
        key={`${index}-start`}
        anchorPoint={AdvancedMarkerAnchorPoint.CENTER}
        position={position}
      >
        <div style={stepMarkerStyle} className="hover:scale-150" />
      </AdvancedMarker>
    );
  });

  return (
    <Map
      id="route-map"
      style={{ width: "100%", height: "100%" }}
      defaultCenter={{ lat: -14.235, lng: -51.9253 }}
      defaultZoom={4.5}
    >
      {from && (
        <AdvancedMarker position={getLocation(from)}>
          <Marker className="text-green-600">
            <User weight="Bold" />
          </Marker>
        </AdvancedMarker>
      )}
      {to && (
        <AdvancedMarker position={getLocation(to)}>
          <Marker className="text-red-600">
            <Pin weight="Bold" />
          </Marker>
        </AdvancedMarker>
      )}

      {polylines}
      {stepMarkers}
    </Map>
  );
};
