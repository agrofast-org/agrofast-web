import { useState, useCallback } from "react";

export function useSearchBox() {
  const [inputValue, setInputValue] = useState("");
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [box, setBox] = useState<google.maps.places.SearchBox>();

  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setBox(ref);
  }, []);

  const onPlacesChanged = useCallback(() => {
    const results = box?.getPlaces() || [];
    setPlaces(results);
    if (results[0]?.formatted_address) {
      setInputValue(results[0].formatted_address);
    }
  }, [box]);

  return {
    inputValue,
    setInputValue,
    places,
    onLoad,
    onPlacesChanged,
  };
}
