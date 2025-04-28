import Button from "@/components/button";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "@/components/input/date-picker";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -14.235,
  lng: -51.9253,
};

type PlacePrediction = {
  description: string;
  place_id: string;
};

const RequestForm: React.FC = () => {
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromResults, setFromResults] = useState<PlacePrediction[]>([]);
  const [toResults, setToResults] = useState<PlacePrediction[]>([]);

  const [fromPlace, setFromPlace] = useState<PlacePrediction | null>(null);
  const [toPlace, setToPlace] = useState<PlacePrediction | null>(null);
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const fetchPlacesProxy = async (
    input: string,
    setter: React.Dispatch<React.SetStateAction<PlacePrediction[]>>
  ) => {
    if (!input) {
      setter([]);
      return;
    }
    const res = await fetch(
      `/api/autocomplete?input=${encodeURIComponent(input)}`
    );
    const data: PlacePrediction[] = await res.json();
    setter(data);
  };

  const [debouncedFetchFrom] = useDebounce((value: string) => {
    fetchPlacesProxy(value, setFromResults);
  }, 300);

  const [debouncedFetchTo] = useDebounce((value: string) => {
    fetchPlacesProxy(value, setToResults);
  }, 300);

  const handleSelectFrom = (key: string) => {
    const sel = fromResults.find((i) => i.place_id === key) || null;
    setFromPlace(sel);
  };

  const handleSelectTo = (key: string) => {
    const sel = toResults.find((i) => i.place_id === key) || null;
    setToPlace(sel);
  };

  const handleCalculateRoute = () => {
    if (!fromPlace || !toPlace) return;
    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: { placeId: fromPlace.place_id },
        destination: { placeId: toPlace.place_id },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

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
            {/* Formulário */}
            <div className="flex-1 sm:p-8">
              <h1 className="font-bold text-2xl">Para onde vamos hoje?</h1>
              <div className="flex flex-col gap-2 mt-4">
                <Autocomplete
                  label="De onde"
                  placeholder="Ex: Rua tal n. xx"
                  inputValue={fromQuery}
                  onInputChange={(v) => {
                    setFromQuery(v);
                    debouncedFetchFrom(v);
                  }}
                  onSelectionChange={handleSelectFrom}
                  items={fromResults}
                  allowsCustomValue
                  className="w-full"
                >
                  {(item) => (
                    <AutocompleteItem key={item.place_id}>
                      {item.description}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <Autocomplete
                  label="Para onde"
                  placeholder="Para onde"
                  inputValue={toQuery}
                  onInputChange={(v) => {
                    setToQuery(v);
                    debouncedFetchTo(v);
                  }}
                  onSelectionChange={handleSelectTo}
                  items={toResults}
                  allowsCustomValue
                  className="w-full"
                >
                  {(item) => (
                    <AutocompleteItem key={item.place_id}>
                      {item.description}
                    </AutocompleteItem>
                  )}
                </Autocomplete>

                <DatePicker label="Escolha uma data" />

                <Button
                  color="primary"
                  onPress={handleCalculateRoute}
                  disabled={!fromPlace || !toPlace}
                >
                  Lançar chamado
                </Button>
              </div>
            </div>
            <div className="hidden relative md:flex flex-1 min-h-[400px]">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={4}
                options={{
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: false,
                  clickableIcons: false,
                  disableDefaultUI: false,
                }}
              >
                {directions && <DirectionsRenderer directions={directions} />}
              </GoogleMap>
            </div>
          </div>
        </section>
      </motion.section>
    </AnimatePresence>
  );
};

export default RequestForm;
