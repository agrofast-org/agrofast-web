// components/RequestForm.tsx
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/button";
import DatePicker from "@/components/input/date-picker";
// import { StandaloneSearchBox } from "@react-google-maps/api";
import { RouteMap } from "@/components/route-map";
import PlaceModalSelector from "@/components/maps/place-modal-selector";
import useRouteDisclosure from "@/hooks/use-route-disclosure";
import PlaceAutocomplete from "@/components/maps/place-autocomplete";

export const RequestForm: React.FC = () => {
  const { setPlaceFrom, setPlaceTo } = useRouteDisclosure(); 
  
  // const fromBox = useSearchBox();
  // const toBox = useSearchBox();
  // const [debouncedFetchFrom] = useDebounce(() => {
  // }, 300);
  // const [debouncedFetchTo] = useDebounce(() => {
  // }, 300);

  // const [fromCoord, setFromCoord] = useState<google.maps.LatLngLiteral | null>(
  //   null
  // );
  // const [toCoord, setToCoord] = useState<google.maps.LatLngLiteral | null>(
  //   null
  // );

  // Quando o usuário escolhe uma place
  // const handleSelectFrom = () => {
  //   const place = fromBox.places[0];
  //   if (place?.geometry?.location) {
  //     setFromCoord({
  //       lat: place.geometry.location.lat(),
  //       lng: place.geometry.location.lng(),
  //     });
  //   }
  // };

  // const handleSelectTo = () => {
  //   const place = toBox.places[0];
  //   if (place?.geometry?.location) {
  //     setToCoord({
  //       lat: place.geometry.location.lat(),
  //       lng: place.geometry.location.lng(),
  //     });
  //   }
  // };

  return (
    <AnimatePresence>
      <motion.section
        key="request-form"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <section className="flex flex-col items-start gap-6 mx-auto p-4 max-w-[912px] container">
          <div className="flex md:flex-row flex-col md:bg-neutral-200/30 dark:md:bg-neutral-800/20 rounded-2xl w-full overflow-hidden">
            <div className="flex flex-col flex-1 gap-2 p-4">
              <h1 className="font-bold text-2xl">Para onde vamos hoje?</h1>

              <PlaceAutocomplete
                label="De onde"
                placeholder="Escolha o local de partida"
                onPlaceSelect={setPlaceFrom}
                // required
                selectOnMap
              />

              <PlaceAutocomplete
                label="Para onde"
                placeholder="Escolha o local de destino"
                onPlaceSelect={setPlaceTo}
                // required
                selectOnMap
              />
              <DatePicker label="Escolha uma data" required />

              <Button
                color="primary"
                onPress={() => {}}
                // disabled={!fromCoord || !toCoord}
                className="mt-4 w-full"
              >
                Lançar chamado
              </Button>
            </div>

            <div className="flex flex-1 min-h-[400px]">
              <RouteMap
              // from={fromCoord} to={toCoord}
              />
            </div>
          </div>
        </section>
      </motion.section>
    </AnimatePresence>
  );
};

export default RequestForm;
