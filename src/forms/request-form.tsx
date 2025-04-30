// components/RequestForm.tsx
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/button";
import DatePicker from "@/components/input/date-picker";
import Input from "@/components/input/input";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";
import { useSearchBox } from "@/hooks/use-search-box";
import { RouteMap } from "@/components/route-map";

export const RequestForm: React.FC = () => {
  const fromBox = useSearchBox();
  const toBox = useSearchBox();
  const [debouncedFetchFrom] = useDebounce(() => {
    /* Seu proxy ou AutocompleteService aqui, usando fromBox.inputValue */
  }, 300);
  const [debouncedFetchTo] = useDebounce(() => {
    /* Igual para toBox */
  }, 300);

  const [fromCoord, setFromCoord] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [toCoord, setToCoord] = useState<google.maps.LatLngLiteral | null>(
    null
  );

  // Quando o usuário escolhe uma place
  const handleSelectFrom = () => {
    const place = fromBox.places[0];
    if (place?.geometry?.location) {
      setFromCoord({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const handleSelectTo = () => {
    const place = toBox.places[0];
    if (place?.geometry?.location) {
      setToCoord({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
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
            <div className="flex-1 gap-4 space-y-4 p-8">
              <h1 className="font-bold text-2xl">Para onde vamos hoje?</h1>

              <StandaloneSearchBox
                onLoad={fromBox.onLoad}
                onPlacesChanged={() => {
                  fromBox.onPlacesChanged();
                  handleSelectFrom();
                }}
              >
                <Input
                  label="De onde"
                  value={fromBox.inputValue}
                  onChange={(e) => {
                    fromBox.setInputValue(e.target.value);
                    debouncedFetchFrom();
                  }}
                  required
                />
              </StandaloneSearchBox>

              <StandaloneSearchBox
                onLoad={toBox.onLoad}
                onPlacesChanged={() => {
                  toBox.onPlacesChanged();
                  handleSelectTo();
                }}
              >
                <Input
                  label="Para onde"
                  value={toBox.inputValue}
                  onChange={(e) => {
                    toBox.setInputValue(e.target.value);
                    debouncedFetchTo();
                  }}
                  required
                />
              </StandaloneSearchBox>

              <DatePicker label="Escolha uma data" required />

              <Button
                color="primary"
                onPress={() => {}}
                disabled={!fromCoord || !toCoord}
              >
                Lançar chamado
              </Button>
            </div>

            <div className="hidden md:flex flex-1 min-h-[400px]">
              <RouteMap from={fromCoord} to={toCoord} />
            </div>
          </div>
        </section>
      </motion.section>
    </AnimatePresence>
  );
};

export default RequestForm;
