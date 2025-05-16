import { AdvancedMarker, MapMouseEvent } from "@vis.gl/react-google-maps";
import Map, { initialCenter } from "../maps/map";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import Marker from "../maps/marker";
import { User } from "@solar-icons/react";
import Button from "../button";

export interface PlaceSelectorProps {
  isOpen: boolean;
  setTempPos: (positions: google.maps.LatLngLiteral | null) => void;
  onClose: () => void;
  handleMapClick: (e: MapMouseEvent) => void;
  tempPos: google.maps.LatLngLiteral | null;
  selectedPos: google.maps.LatLngLiteral | null;
  handleConfirmMap: () => void;
}

const PlaceSelectionModal: React.FC<PlaceSelectorProps> = ({
  isOpen,
  setTempPos,
  onClose,
  handleMapClick,
  tempPos,
  selectedPos,
  handleConfirmMap,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setTempPos(null);
          onClose();
        }}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Selecione no mapa</ModalHeader>
          <ModalBody className="p-2 px-4">
            <div className="relative min-h-96">
              <Map
                id="place-autocomplete-modal-map"
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
                onClick={handleMapClick}
                defaultZoom={selectedPos ? 14 : 5}
                defaultCenter={selectedPos ?? initialCenter}
              >
                {tempPos && (
                  <AdvancedMarker position={tempPos}>
                    <Marker className="text-red-600">
                      <User weight="Bold" />
                    </Marker>
                  </AdvancedMarker>
                )}
                {!tempPos && selectedPos && (
                  <AdvancedMarker position={selectedPos}>
                    <Marker className="text-blue-600">
                      <User weight="Bold" />
                    </Marker>
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

export default PlaceSelectionModal;
