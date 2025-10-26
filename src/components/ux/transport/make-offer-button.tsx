import ConditionalModal from "@/components/conditional-modal";
import { OfferForm } from "@/forms/transport/offer-form";
import { Button, useDisclosure } from "@heroui/react";

export interface MakeOfferButtonProps {
  uuid: string;
}

export const MakeOfferButton: React.FC<MakeOfferButtonProps> = ({ uuid }) => {
  const disclosure = useDisclosure();
  return (
    <>
      <ConditionalModal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
        <OfferForm
          uuid={uuid}
          open={disclosure.isOpen}
          onClose={disclosure.onClose}
        />
      </ConditionalModal>
      <Button color="primary" onPress={disclosure.onOpen}>
        Fazer proposta
      </Button>
    </>
  );
};
