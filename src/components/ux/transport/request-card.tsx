import { Avatar } from "@/components/avatar";
import { Textarea } from "@/components/input/textarea";
import Map from "@/components/maps/map";
import { formatCurrency, formatDistance, formatDuration } from "@/lib/utils";
import { Request } from "@/types/transport";
import { Card, CardBody, CardHeader, cn } from "@heroui/react";
import { ArrowRight, Star } from "@solar-icons/react";
import { useMap } from "@vis.gl/react-google-maps";
import { JSX, useEffect, useId, useMemo, useState } from "react";
import { MakeOfferButton } from "./make-offer-button";
import { Button } from "@/components/button";

export interface RequestCardProps {
  request: Request;
  offerButton?: boolean;
}

export const StarRater: React.FC = () => {
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(0);

  const stars = useMemo(() => {
    const starsArray: JSX.Element[] = [];

    const renderHalf = (i: number) => (
      <div
        className={cn(
          "relative overflow-hidden flex max-w-[14px] min-h-[28px] min-w-[14px]",
          i % 2 === 1 ? "justify-start" : "justify-end",
        )}
        key={i}
      >
        <Star
          size={28}
          className="absolute p-0.5 min-w-[28px] text-default-300 scale-110"
        />

        <Star
          size={28}
          className={cn(
            "absolute p-0.5 min-w-[28px] text-default-700 transition-[opacity,color] duration-75",
            hovered >= 0 && "text-default-400",
            i <= hovered ? "opacity-100" : "opacity-25",
            i <= rating && "text-yellow-300 opacity-100",
          )}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => setRating(i)}
          weight="Bold"
        />
      </div>
    );

    for (let pair = 0; pair < 5; pair++) {
      const leftIndex = pair * 2 + 1;
      const rightIndex = leftIndex + 1;

      starsArray.push(
        <div
          className="flex items-center active:scale-90 transition-transform duration-75"
          key={`pair-${pair}`}
        >
          {renderHalf(leftIndex)}
          {renderHalf(rightIndex)}
        </div>,
      );
    }

    return starsArray;
  }, [hovered, rating]);

  return <div className="flex items-center pb-4">{stars}</div>;
};

export const ItemWithLabel: React.FC<{
  label: string;
  lableClassName?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, lableClassName, children, className }) => {
  return (
    <p className={cn("text-start", className)}>
      <span className={cn("font-semibold", lableClassName)}>{label}</span>:{" "}
      {children}
    </p>
  );
};

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  offerButton = true,
}) => {
  const id = useId();
  const map = useMap(id);

  const origin = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: Number(request.origin_latitude),
      lng: Number(request.origin_longitude),
    }),
    [request.origin_latitude, request.origin_longitude],
  );
  const destination = useMemo<google.maps.LatLngLiteral>(
    () => ({
      lat: Number(request.destination_latitude),
      lng: Number(request.destination_longitude),
    }),
    [request.destination_latitude, request.destination_longitude],
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
    <>
      <Card className="flex-col gap-4 shadow-sm mb-4 p-4 sm:w-[812px] max-w-full sm:h-[304px]">
        <CardHeader className="flex justify-center items-center gap-2 bg-default-200/40 shadow-sm p-1 rounded-lg max-h-min">
          <p
            className="flex-1 text-end truncate"
            title={request?.origin_place_name}
          >
            {request?.origin_place_name}
          </p>
          <ArrowRight />
          <p
            className="flex-1 text-start truncate"
            title={request?.destination_place_name}
          >
            {request?.destination_place_name}
          </p>
        </CardHeader>
        <CardBody className="flex sm:flex-row flex-col gap-4 p-0 w-full h-full">
          <div className="w-56 h-56 sm:h-full">
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
              {/* {origin && (
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
            )} */}
            </Map>
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 min-w-max">
                <Avatar src={request?.user?.profile_picture} />{" "}
                {request?.user?.name}
              </div>
            </div>

            <ItemWithLabel label="Distancia Estimada">
              {formatDistance(request?.distance)}
            </ItemWithLabel>
            <ItemWithLabel label="Tempo Estimado">
              {formatDuration(request?.estimated_time)}
            </ItemWithLabel>
            <ItemWithLabel label="Valor Estimado">
              {formatCurrency(request?.estimated_cost)}
            </ItemWithLabel>
            <ItemWithLabel label="Data desejada">
              {request?.desired_date
                ? new Date(request?.desired_date).toLocaleDateString()
                : "Sem data desejada"}
            </ItemWithLabel>
          </div>
          {offerButton && (
            <div className="flex items-end">
              <MakeOfferButton uuid={request.uuid} />
            </div>
          )}
        </CardBody>
      </Card>
      <Card className="flex-col gap-0 shadow-sm mb-4 px-4 max-w-96 pb-4">
        <CardHeader className="flex justify-center flex-col items-center">
          <h3 className="text-lg font-semibold">Avalie o serviço</h3>
          <p className="text-center text-sm text-gray-600">
            Avalie seu motorista após a entrega para ajudar outros usuários a
            escolherem os melhores profissionais!
          </p>
        </CardHeader>
        <CardBody className="p-0 flex items-center">
          <StarRater />
          <Textarea placeholder="Adicione um comentário sobre o seu chamado..." />
          <Button color="primary" className="w-full mt-4">Enviar Avaliação</Button>
        </CardBody>
      </Card>
    </>
  );
};
