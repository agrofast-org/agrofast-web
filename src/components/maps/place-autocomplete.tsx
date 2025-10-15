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
  useMap,
} from "@vis.gl/react-google-maps";
import { useAutocompleteSuggestions } from "@/hooks/use-autocomplete-suggestions";
import { useDebounce } from "@/hooks/use-debounce";
import { useDisclosure } from "@heroui/react";
import { MapPointSearch, PointOnMap } from "@solar-icons/react";
import PlaceSelectionModal from "../ux/place-selection-modal";
import { cn } from "@/lib/utils";

export interface PlaceAutocompleteProps {
  name?: string;
  label?: string;
  placeholder?: string;
  selectOnMap?: boolean;
  allowCoordinates?: boolean;
  onPlaceSelect: (
    place: google.maps.places.Place | google.maps.places.PlaceResult | null
  ) => void;
  className?: string;
}

export const PlaceAutocomplete: React.FC<PlaceAutocompleteProps> = ({
  name,
  label,
  placeholder,
  selectOnMap = false,
  allowCoordinates = selectOnMap,
  onPlaceSelect,
  className,
}) => {
  const map = useMap("place-autocomplete-modal-map");
  const placesLib = useMapsLibrary("places");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [debounceQuery] = useDebounce((v: string) => setQuery(v), 300);

  const { suggestions, resetSession } = useAutocompleteSuggestions(query);

  const [selectedPos, setSelectedPos] =
    useState<google.maps.LatLngLiteral | null>(null);

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
      if (key === null) {
        return;
      }

      if (key === selectedKey) {
        return;
      }

      setSelectedKey(key);
      setQuery("");
      resetSession();

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

      if (place.location) {
        const { lat, lng } = place.location.toJSON();
        setSelectedPos({ lat, lng });
      }

      onPlaceSelect(place);
    },
    [selectedKey, suggestions, resetSession, onPlaceSelect]
  );

  const handleMapClick = useCallback(
    (e: MapMouseEvent) => {
      if (e.detail?.latLng) {
        setTempPos(e.detail.latLng);

        map?.panToBounds(
          new google.maps.LatLngBounds(e.detail.latLng, e.detail.latLng),
          400
        );
        map?.setZoom(14);
      }
    },
    [map]
  );

  const handleConfirmMap = useCallback(() => {
    if (!tempPos || !serviceRef.current) {
      onPlaceSelect(null);
      onClose();
      return;
    }

    new google.maps.Geocoder().geocode({ location: tempPos }, (res, status) => {
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
              const loc = place.geometry!.location;
              if (loc) {
                const pos = { lat: loc.lat(), lng: loc.lng() };
                setSelectedPos(pos);
              }
              onPlaceSelect(place);
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
      <div className={cn("flex items-end gap-2", className)}>
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
          clearButtonProps={{
            onPress: () => {
              setInputValue("");
              setSelectedKey(null);
              setQuery("");
              resetSession();
              onPlaceSelect(null);
            }
          }}
        >
          {items.length === 0 ? (
            <AutocompleteItem
              startContent={
                !suggestions.length && !query ? (
                  <MapPointSearch className="size-5 text-default-500" />
                ) : undefined
              }
              className="!bg-transparent pointer-events-none"
              key={null}
              aria-disabled
            >
              {query && !suggestions.length ? (
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
              ) : (
                <span className="text-gray-500">
                  {query ? "Nenhum resultado" : "Pesquisar um local"}
                </span>
              )}
            </AutocompleteItem>
          ) : (
            (item) => (
              <AutocompleteItem
                startContent={
                  <MapPointSearch className="size-5 text-default-500" />
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
              weight="BoldDuotone"
              className="size-6 text-default-500"
            />
          </Button>
        )}
      </div>

      <PlaceSelectionModal
        isOpen={isOpen}
        tempPos={tempPos}
        selectedPos={selectedPos}
        onClose={onClose}
        setTempPos={setTempPos}
        handleMapClick={handleMapClick}
        handleConfirmMap={handleConfirmMap}
      />
    </>
  );
};

export default PlaceAutocomplete;
