import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/button";
import { RouteMap } from "@/components/route-map";
import useRouteDisclosure, { getPlaceId } from "@/hooks/use-route-disclosure";
import PlaceAutocomplete from "@/components/maps/place-autocomplete";
import { cn } from "@/lib/utils";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useAuth } from "@/contexts/auth-provider";
import { useRef, useState } from "react";
import { postRequest } from "@/http/request/make-request";
import { useRouter } from "next/router";
import { useToast } from "@/service/toast";
import { RequestForm as CrudRequestForm } from "@/components/request-form";
import { useLoadingDisclosure } from "@/hooks/use-loading-disclosure";
import { DatePicker } from "@/components/input/date-picker";
import { getLocalTimeZone, today } from "@internationalized/date";

export const RequestForm: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const loadingDisclosure = useLoadingDisclosure();
  const placeFromRef = useRef<HTMLInputElement | null>(null);
  const placeToRef = useRef<HTMLInputElement | null>(null);
  const machineryRef = useRef<HTMLInputElement | null>(null);

  const { placeFrom, setPlaceFrom, placeTo, setPlaceTo } = useRouteDisclosure();
  const { machinery } = useAuth();
  const [machineUuid, setMachineUuid] = useState<string | undefined>();

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
          <div className="flex md:flex-row flex-col md:border border-default-200 rounded-2xl w-full overflow-hidden">
            <CrudRequestForm
              loadingDisclosure={loadingDisclosure}
              onSubmit={() => {
                const fromPlaceId = getPlaceId(placeFrom ?? undefined);
                const toPlaceId = getPlaceId(placeTo ?? undefined);
                return postRequest({
                  origin_place_id: fromPlaceId,
                  destination_place_id: toPlaceId,
                  machine_uuid: machineUuid,
                });
              }}
              onSuccess={({ data }) => {
                if (data?.request_uuid) {
                  router.push(`/web/request/${data.request_uuid}`);
                  return;
                }
                router.push("/web/request");
              }}
              onError={() => {
                toast.error({
                  description: "Erro ao lançar chamado",
                });
              }}
              className={cn(
                "top-16 focus-within:top-0 z-50 md:static absolute flex flex-col flex-1 gap-2 bg-default-100 md:p-4 pt-2 pb-0 border-neutral-200 dark:border-neutral-700 border-b md:border-b-0 w-full transition-[top]",
                placeFrom && "top-0"
              )}
            >
              <h1 className="hidden md:flex font-bold text-default-600 text-2xl">
                Para onde vamos hoje?
              </h1>
              <div
                className={cn(
                  "flex flex-col gap-1 px-4 md:px-0 w-full overflow-hidden md:overflow-visible transition-size duration-300",
                  placeFrom
                    ? placeTo
                      ? machineUuid
                        ? "h-72 md:h-auto"
                        : "h-[216px] md:h-auto"
                      : "h-36 md:h-auto"
                    : "h-20 md:h-auto"
                )}
              >
                <PlaceAutocomplete
                  ref={placeFromRef}
                  label="De onde"
                  placeholder="Escolha o local de partida"
                  onPlaceSelect={(val) => {
                    setPlaceFrom(val);
                    // placeToRef.current?.focus();
                  }}
                  selectOnMap
                />
                <PlaceAutocomplete
                  ref={placeToRef}
                  label="Para onde"
                  placeholder="Escolha o local de destino"
                  onPlaceSelect={(val) => {
                    setPlaceTo(val);
                    // machineryRef.current?.focus();
                  }}
                  selectOnMap
                  className={cn(
                    "transition-opacity",
                    !placeFrom ? "opacity-0 md:opacity-100" : "opacity-100"
                  )}
                />
                {machinery && machinery.length > 0 && (
                  <Autocomplete
                    ref={machineryRef}
                    name="machine_uuid"
                    label="Maquinário"
                    placeholder="Escolha a máquina a ser transportada"
                    className="w-full autocomplete"
                    labelPlacement="outside"
                    variant="bordered"
                    onSelectionChange={(key) => {
                      setMachineUuid(key as string | undefined);
                      machineryRef.current?.blur();
                    }}
                    isRequired
                  >
                    {machinery.map((machine) => (
                      <AutocompleteItem key={machine.uuid}>
                        {machine.name}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                )}
                <DatePicker
                  name="desired_date"
                  label="Data desejada"
                  minValue={today(getLocalTimeZone())}
                />
              </div>
              <Button
                color="primary"
                isDisabled={
                  !placeFrom ||
                  !placeTo ||
                  !machineUuid ||
                  loadingDisclosure.isLoading
                }
                isLoading={loadingDisclosure.isLoading}
                type="submit"
                className={cn(
                  "top-[calc(100svh-9rem)] z-50 md:static absolute mx-4 md:mx-0 mt-4 w-[calc(100%-2rem)] md:w-full",
                  (!placeFrom || !placeTo || !machineUuid) &&
                    "md:opacity-disabled opacity-0"
                )}
              >
                Lançar chamado
              </Button>
            </CrudRequestForm>
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
