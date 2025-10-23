import { Avatar } from "@/components/avatar";
import Map from "@/components/maps/map";
import Marker from "@/components/maps/marker";
import { formatCurrency, formatDistance, formatDuration } from "@/lib/utils";
import { Request } from "@/types/transport";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { ArrowRight, Pin, User } from "@solar-icons/react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useId, useMemo } from "react";

export interface RequestCardProps {
  request: Request;
}

export const ItemWithLabel: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => {
  return (
    <p className="text-start">
      <span className="font-semibold">{label}</span>: {children}
    </p>
  );
};

export const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const id = useId();
  const map = useMap(id);

  const origin = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: Number(request.origin_latitude),
      lng: Number(request.origin_longitude),
    }),
    [request.origin_latitude, request.origin_longitude]
  );
  const destination = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: Number(request.destination_latitude),
      lng: Number(request.destination_longitude),
    }),
    [request.destination_latitude, request.destination_longitude]
  );

  useEffect(() => {
    if (map && (origin || destination)) {
      const bounds = new google.maps.LatLngBounds();
      if (origin) {
        bounds.extend(origin);
      }
      if (destination) {
        bounds.extend(destination);
      }
      map.fitBounds(bounds, 14);
    }
  }, [origin, destination, map]);

  return (
    <Card className="flex-col gap-4 shadow-sm mb-4 p-4 w-[812px] h-[304px]">
      <CardHeader className="flex justify-center items-center gap-2 bg-default-200/40 shadow-sm p-1 rounded-lg max-h-min">
        <p
          className="flex-1 text-end truncate"
          title={request.origin_place_name}
        >
          {request.origin_place_name}
        </p>
        <ArrowRight />
        <p
          className="flex-1 text-start truncate"
          title={request.destination_place_name}
        >
          {request.destination_place_name}
        </p>
      </CardHeader>
      <CardBody className="flex flex-row gap-4 p-0 w-full h-64">
        <div className="w-56 h-full">
          <Map
            id={id}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
              overflow: "hidden",
            }}
            cameraControl={false}
            gestureHandling="none"
            clickableIcons={false}
            mapTypeControl={false}
          >
            {origin && (
              <AdvancedMarker position={origin}>
                <Marker className="text-green-600">
                  <User weight="Bold" />
                </Marker>
              </AdvancedMarker>
            )}
            {destination && (
              <AdvancedMarker position={destination}>
                <Marker className="text-red-600">
                  <Pin weight="Bold" />
                </Marker>
              </AdvancedMarker>
            )}
          </Map>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-max">
              <Avatar src={request.user.profile_picture} /> {request.user.name}
            </div>
          </div>

          <ItemWithLabel label="Distancia Estimada">
            {formatDistance(request.distance)}
          </ItemWithLabel>
          <ItemWithLabel label="Tempo Estimado">
            {formatDuration(request.estimated_time)}
          </ItemWithLabel>
          <ItemWithLabel label="Valor Estimado">
            {formatCurrency(request.estimated_cost)}
          </ItemWithLabel>
        </div>
        <div className="flex items-end">
          <Button color="primary">Fazer proposta</Button>
        </div>
      </CardBody>
    </Card>
  );
};
