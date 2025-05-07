// components/RequestForm.tsx
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/button";
import { RouteMap } from "@/components/route-map";
import useRouteDisclosure from "@/hooks/use-route-disclosure";
import PlaceAutocomplete from "@/components/maps/place-autocomplete";
import { cn } from "@/lib/utils";

export const RequestForm: React.FC = () => {
  const { placeFrom, setPlaceFrom, placeTo, setPlaceTo } = useRouteDisclosure();

  return (
    <AnimatePresence>
      <motion.section
        key="request-form"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
      >
        <section className="flex flex-col items-start gap-6 mx-auto md:p-4 max-w-[912px] container">
          <div className="flex md:flex-row flex-col md:bg-neutral-200/30 dark:md:bg-neutral-800/20 rounded-2xl w-full overflow-hidden">
            <div
              className={cn(
                "top-[65px] focus-within:top-0 z-50 md:static absolute flex flex-col flex-1 gap-2 bg-default-100 md:bg-none md:p-4 pt-2 pb-0 border-neutral-200 dark:border-neutral-700 border-b md:border-b-0 w-full transition-[top]",
                placeFrom && "top-0"
              )}
            >
              <h1 className="hidden md:flex font-bold text-2xl">
                Para onde vamos hoje?
              </h1>
              <div
                className={cn(
                  "flex flex-col gap-2 px-4 md:px-0 overflow-hidden transition-size duration-300",
                  placeFrom ? "h-[9.5rem] md:h-auto" : "h-20 md:h-auto"
                )}
              >
                <PlaceAutocomplete
                  label="De onde"
                  placeholder="Escolha o local de partida"
                  onPlaceSelect={setPlaceFrom}
                  selectOnMap
                />
                <PlaceAutocomplete
                  label="Para onde"
                  placeholder="Escolha o local de destino"
                  onPlaceSelect={setPlaceTo}
                  selectOnMap
                  className={cn(
                    "transition-opacity",
                    !placeFrom ? "opacity-0 md:opacity-100" : "opacity-100"
                  )}
                />
              </div>
              <Button
                color="primary"
                onPress={() => {}}
                isDisabled={!placeFrom || !placeTo}
                className={cn(
                  "top-[calc(100svh-9rem)] z-50 md:static absolute mx-4 md:mx-0 mt-4 w-[calc(100%-2rem)] md:w-full",
                  (!placeFrom || !placeTo) && "md:opacity-disabled opacity-0"
                )}
              >
                Lançar chamado
              </Button>
            </div>
            <div className="md:static absolute inset-0 flex flex-1 min-h-[400px]">
              <RouteMap from={placeFrom} to={placeTo} />
            </div>
          </div>
        </section>
      </motion.section>
    </AnimatePresence>
  );
};

export default RequestForm;
