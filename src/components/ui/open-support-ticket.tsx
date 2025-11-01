import ConditionalModal from "@/components/conditional-modal";
import { SupportRequestForm } from "@/forms/transport/support-request-form";
import { Button, useDisclosure } from "@heroui/react";
import { QuestionCircle } from "@solar-icons/react";

export interface MakeOfferButtonProps {
  message?: string;
}

export const OpenSupportOption: React.FC<MakeOfferButtonProps> = () => {
  const disclosure = useDisclosure();
  return (
    <>
      <ConditionalModal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
        <SupportRequestForm onClose={disclosure.onClose} />
      </ConditionalModal>
      <Button
        color="primary"
        onPress={disclosure.onOpen}
        className="sm:hidden flex"
        isIconOnly
      >
        <QuestionCircle />
      </Button>
      <Button
        color="primary"
        onPress={disclosure.onOpen}
        className="sm:flex hidden"
      >
        <p>Preciso de ajuda</p>
      </Button>
    </>
  );
};
