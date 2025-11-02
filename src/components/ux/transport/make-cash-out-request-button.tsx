import ConditionalModal from "@/components/conditional-modal";
import { CashOutForm } from "@/forms/transport/cash-out-form";
import { Button, useDisclosure } from "@heroui/react";

export interface MakeCashOutRequestButtonProps {
  uuid?: string;
}

export const MakeCashOutRequestButton: React.FC<
  MakeCashOutRequestButtonProps
> = () => {
  const disclosure = useDisclosure();

  return (
    <>
      <ConditionalModal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
        <CashOutForm open={disclosure.isOpen} onClose={disclosure.onClose} />
      </ConditionalModal>
      <Button
        color="primary"
        onPress={disclosure.onOpen}
        className="bg-default-200 text-default-700"
      >
        Nova solicitação de saque
      </Button>
    </>
  );
};
