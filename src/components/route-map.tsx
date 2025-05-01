import Map from "./maps/map";


export interface RouteMapProps {
  from?: google.maps.LatLngLiteral;
  to?: google.maps.LatLngLiteral;
}

export const RouteMap: React.FC<RouteMapProps> = ({ from, to }) => {
  // const map = useMap();
  // const [currentPos, setCurrentPos] = useState<google.maps.LatLngLiteral>();
  // const [directionsRenderer, setDirectionsRenderer] =
  //   useState<google.maps.DirectionsRenderer>();

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(({ coords }) => {
  //     const pos = { lat: coords.latitude, lng: coords.longitude };
  //     setCurrentPos(pos);
  //     map?.panTo(pos);
  //   });
  // }, [map]);

  // useEffect(() => {
  //   if (!map) return;
  //   const renderer = new google.maps.DirectionsRenderer();
  //   renderer.setMap(map);
  //   setDirectionsRenderer(renderer);
  // }, [map]);

  // const calculateRoute = useCallback(() => {
  //   if (!from || !to || !directionsRenderer) return;
  //   const service = new google.maps.DirectionsService();
  //   service.route(
  //     {
  //       origin: from,
  //       destination: to,
  //       // travelMode: "DRIVING"
  //     },
  //     (result, status) => {
  //       if (status === "OK" && result) {
  //         directionsRenderer.setDirections(result);
  //       }
  //     }
  //   );
  // }, [from, to, directionsRenderer]);

  // useEffect(() => {
  //   calculateRoute();
  // }, [calculateRoute]);

  return (
    <Map

    >
      {/* {currentPos && (
        <AdvancedMarker position={currentPos} title="Você está aqui" />
      )}
      {!directionsRenderer && from && <AdvancedMarker position={from} />}
      {!directionsRenderer && to && <AdvancedMarker position={to} />} */}
      {/* A rota é desenhada via DirectionsRenderer imperativo */}
    </Map>
  );
};
