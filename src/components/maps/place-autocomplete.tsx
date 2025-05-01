import React, {
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Autocomplete, AutocompleteItem, Button, Spinner } from "@heroui/react";
import {
  useMapsLibrary,
  MapMouseEvent,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useAutocompleteSuggestions } from "@/hooks/use-autocomplete-suggestions";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import { useDisclosure } from "@heroui/react";
import { MapPoint, MapPointSearch, PointOnMap, User } from "@solar-icons/react";
import Map from "./map";
import Marker from "./marker";

export interface PlaceAutocompleteProps {
  name?: string;
  label?: string;
  placeholder?: string;
  selectOnMap?: boolean;
  allowCoordinates?: boolean;
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  name,
  label,
  placeholder,
  selectOnMap = false,
  allowCoordinates = selectOnMap,
  onPlaceSelect,
}) => {
  const placesLib = useMapsLibrary("places");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [debounceQuery, , queryDebouncing] = useDebounce(
    (v: string) => setQuery(v),
    300
  );

  const { suggestions, resetSession } = useAutocompleteSuggestions(query);

  const [tempPos, setTempPos] = useState<google.maps.LatLngLiteral | null>(
    null
  );

  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);
  useEffect(() => {
    if (placesLib && !serviceRef.current) {
      serviceRef.current = new google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [placesLib]);

  const items = useMemo(
    () =>
      suggestions.map((s) => ({
        key: s.placePrediction!.placeId,
        label: s.placePrediction!.text.text,
      })),
    [suggestions]
  );

  const handleInputChange = useCallback(
    (v: string) => {
      if (v === inputValue) return;
      setInputValue(v);
      setSelectedKey(null);
      debounceQuery(v);
    },
    [inputValue, debounceQuery]
  );

  const handleSelectionChange = useCallback(
    async (key: string | null) => {
      if (key === selectedKey) return;
      setSelectedKey(key);

      setQuery("");
      resetSession();

      if (!key || !placesLib) {
        onPlaceSelect(null);
        return;
      }

      const sug = suggestions.find((s) => s.placePrediction!.placeId === key)!;
      const label = sug.placePrediction!.text.text;
      setInputValue(label);

      const place = sug.placePrediction!.toPlace();
      await place.fetchFields({
        fields: [
          "viewport",
          "location",
          "svgIconMaskURI",
          "iconBackgroundColor",
        ],
      });
      onPlaceSelect(place as google.maps.places.PlaceResult);
    },
    [selectedKey, placesLib, suggestions, onPlaceSelect, resetSession]
  );

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      setTempPos(e.detail.latLng);
    }
  }, []);

  const handleConfirmMap = useCallback(() => {
    if (!tempPos || !serviceRef.current) {
      onPlaceSelect(null);
      onClose();
      return;
    }

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: tempPos }, (res, status) => {
      if (status === "OK" && res?.[0]?.place_id) {
        const pid = res[0].place_id;
        serviceRef.current!.getDetails(
          {
            placeId: pid,
            fields: ["place_id", "formatted_address", "geometry", "name"],
          },
          (place, st) => {
            if (st === google.maps.places.PlacesServiceStatus.OK && place) {
              setInputValue(place.formatted_address || "");
              setSelectedKey(place.place_id!);
              onPlaceSelect(place as google.maps.places.PlaceResult);
            } else {
              onPlaceSelect(null);
            }
            resetSession();
            setTempPos(null);
            onClose();
          }
        );
      } else {
        onPlaceSelect(null);
        setTempPos(null);
        onClose();
      }
    });
  }, [tempPos, onPlaceSelect, onClose, resetSession]);

  return (
    <>
      <div className="flex gap-2">
        <Autocomplete
          name={name}
          label={label}
          placeholder={placeholder}
          className="w-full autocomplete"
          inputValue={inputValue}
          selectedKey={selectedKey}
          items={items}
          allowsCustomValue={allowCoordinates}
          onInputChange={handleInputChange}
          onSelectionChange={(k) => handleSelectionChange(k as string | null)}
          labelPlacement="outside"
          variant="bordered"
        >
          {items.length === 0 ? (
            <AutocompleteItem
              startContent={
                <>
                  {!queryDebouncing && (
                    <MapPointSearch
                      weight="LineDuotone"
                      className="size-5 text-default-500"
                    />
                  )}
                </>
              }
              className="!bg-transparent pointer-events-none"
              key={null}
              aria-disabled
            >
              {queryDebouncing ? (
                <div className="flex justify-center items-center gap-2">
                  <Spinner
                    size="sm"
                    classNames={{
                      circle1: "!border-b-default-600",
                      circle2: "!border-b-default-600",
                    }}
                  />
                  <span>Carregando...</span>
                </div>
              ) : inputValue === "" ? (
                <span className="text-gray-500">Pesquisar um local</span>
              ) : (
                <span className="text-gray-500">
                  Nenhum resultado encontrado
                </span>
              )}
            </AutocompleteItem>
          ) : (
            (item) => (
              <AutocompleteItem
                startContent={
                  <MapPoint weight="Bold" className="size-5 text-default-500" />
                }
                key={item.key}
              >
                {item.label}
              </AutocompleteItem>
            )
          )}
        </Autocomplete>

        {selectOnMap && (
          <Button
            isIconOnly
            onPress={onOpen}
            className="self-end"
            aria-label="Selecionar no mapa"
          >
            <PointOnMap
              className="size-6 text-default-500"
              weight="BoldDuotone"
            />
          </Button>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setTempPos(null);
          onClose();
        }}
      >
        <ModalContent>
          <ModalHeader>Selecione no mapa</ModalHeader>
          <ModalBody className="p-2 px-4">
            <div className="relative min-h-96 size-full">
              <Map
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                }}
                onClick={handleMapClick}
              >
                {tempPos && (
                  <AdvancedMarker position={tempPos}>
                    <Marker classname="text-red-600"><User weight="Bold" /></Marker>
                  </AdvancedMarker>
                )}
              </Map>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => {
                setTempPos(null);
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleConfirmMap}
              isDisabled={!tempPos}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlaceAutocomplete;
