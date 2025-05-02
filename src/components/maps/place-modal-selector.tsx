import React, { FormEvent, useCallback, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useAutocompleteSuggestions } from "@/hooks/use-autocomplete-suggestions";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import Button from "../button";
import { useDisclosure } from "@heroui/react";
import Input from "../input/input";

interface PlaceSelectorProps {
  onPlaceSelect: (place: google.maps.places.Place | null) => void;
}

const PlaceModalSelector: React.FC<PlaceSelectorProps> = ({ onPlaceSelect }) => {
  const { isOpen, onOpen, onClose: closeModal } = useDisclosure();

  const places = useMapsLibrary("places");

  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");

  const [debounceQuery, cancelDebounce] = useDebounce(
    (val: string) => {
      setQuery(val);
    },
    300
  );

  const { suggestions, resetSession } = useAutocompleteSuggestions(query);

  const handleInput = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      const v = (event.target as HTMLInputElement).value;
      setInputValue(v);
      debounceQuery(v);
    },
    [debounceQuery]
  );

  const handleSuggestionClick = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!places || !suggestion.placePrediction) return;

      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: [
          "viewport",
          "location",
          "svgIconMaskURI",
          "iconBackgroundColor",
        ],
      });

      setInputValue("");
      resetSession();
      onPlaceSelect(place);
      cancelDebounce();
      closeModal();
    },
    [places, onPlaceSelect, resetSession, cancelDebounce, closeModal]
  );

  const handleClose = useCallback(() => {
    cancelDebounce();
    closeModal();
  }, [cancelDebounce, closeModal]);

  const isLoading = query !== "" && suggestions.length === 0;

  return (
    <>
      <Button onPress={onOpen}>Pesquisar</Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>Pesquisar</ModalHeader>
          <ModalBody>
            <Input
              label="Pesquisar"
              placeholder="Digite o nome do local"
              value={inputValue}
              onChange={handleInput}
            />
            {isLoading && <p>Carregando...</p>}
            {suggestions.length > 0 && (
              <ul className="custom-list">
                {suggestions.map((s, idx) => (
                  <li
                    key={idx}
                    className="custom-list-item"
                    onClick={() => handleSuggestionClick(s)}
                  >
                    {s.placePrediction?.text.text}
                  </li>
                ))}
              </ul>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PlaceModalSelector;
