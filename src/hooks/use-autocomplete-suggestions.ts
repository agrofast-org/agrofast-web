import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState, useMemo } from "react";

export type UseAutocompleteSuggestionsReturn = {
  suggestions: google.maps.places.AutocompleteSuggestion[];
  isLoading: boolean;
  resetSession: () => void;
};

export function useAutocompleteSuggestions(
  inputString: string,
  requestOptions: Partial<google.maps.places.AutocompleteRequest> = {}
): UseAutocompleteSuggestionsReturn {
  const placesLib = useMapsLibrary("places");
  const sessionTokenRef =
    useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const memoOptions = useMemo(
    () => requestOptions,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(requestOptions)]
  );

  useEffect(() => {
    if (!placesLib) return;

    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    }

    if (inputString.trim() === "") {
      if (suggestions.length > 0) {
        setSuggestions([]);
      }
      return;
    }

    const req: google.maps.places.AutocompleteRequest = {
      ...memoOptions,
      input: inputString,
      sessionToken: sessionTokenRef.current,
    };

    setIsLoading(true);
    placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions(req)
      .then((res) => {
        setSuggestions(res.suggestions);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inputString, suggestions.length, memoOptions, placesLib]);

  return {
    suggestions,
    isLoading,
    resetSession: () => {
      sessionTokenRef.current = null;
      setSuggestions([]);
    },
  };
}
