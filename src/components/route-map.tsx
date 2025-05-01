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

export interface RouteMapProps {
  from?: google.maps.places.Place | null;
  to?: google.maps.places.Place | null;
}

const timestamp = Math.ceil(Date.now() / 86_400_000) * 86_400_000 + 900_000;
const departureTime = new Date(timestamp).toISOString();

export const defaultAppearance = {
  walkingPolylineColor:  "var(--map-walking-color)",
  defaultPolylineColor:  "var(--map-default-color)",
  stepMarkerFillColor:   "var(--map-marker-fill)",
  stepMarkerBorderColor: "var(--map-marker-border)",
};

const routeOptions = {
  travelMode: "DRIVE",
  // departureTime,
  computeAlternativeRoutes: false,
  units: "METRIC",
};

export const RouteMap: React.FC<RouteMapProps> = ({ from, to }) => {
  const map = useMap("route-map");

  const [route, setRoute] = useState<google.maps.DirectionsRoute | null>(null);

  useEffect(() => {
    if (map && (from || to)) {
      const bounds = new google.maps.LatLngBounds();
      if (from && from.location) {
        bounds.extend(from.location);
      }
      if (to && to.location) {
        bounds.extend(to.location);
      }
      map.fitBounds(bounds);
    }
  }, [from, to, map]);

  useEffect(() => {
    if (!map) return;

    if (from?.location && to?.location) {
      mapsApi
        .computeRoutes(
          { lat: from.location.lat(), lng: from.location.lng() },
          { lat: to.location.lat(), lng: to.location.lng() },
          routeOptions
        )
        .then((res) => {
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
    const isWalking = step.travelMode === "WALK";
    const color = isWalking
      ? appearance.walkingPolylineColor
      : step?.transitDetails?.transitLine?.color ??
        appearance.defaultPolylineColor;

    return (
      <Polyline
        key={`${index}-polyline`}
        encodedPath={step.polyline.encodedPolyline}
        strokeWeight={isWalking ? 2 : 6}
        strokeColor={color}
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
        <div style={stepMarkerStyle} />
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
        <AdvancedMarker position={from.location}>
          <Marker className="text-green-600">
            <User weight="Bold" />
          </Marker>
        </AdvancedMarker>
      )}
      {to && (
        <AdvancedMarker position={to.location}>
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
