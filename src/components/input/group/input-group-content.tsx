import { useDisclosure } from "@heroui/react";
import { useGroup } from "@/components/input/group/input-group";
import Button from "@/components/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/modal";

export interface InputGroupContentProps {
  children?: React.ReactNode;
}

const InputGroupContent: React.FC<InputGroupContentProps> = ({ children }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const inputGroup = useGroup();

  if (!inputGroup) {
    return null;
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => {
            return (
              <>
                <ModalHeader>{inputGroup.label}</ModalHeader>
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                  <Button onPress={onClose}>Fechar</Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      onClose();
                      inputGroup.addNew();
                    }}
                  >
                    Confirmar
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
      <Button
        variant="flat"
        className="bg-default-100 hover:bg-default-200 shadow-sm duration-100"
        onPress={onOpen}
      >
        {inputGroup.count - inputGroup.excluded.length <= 0
          ? `Cadastrar um ${inputGroup.label?.toLocaleLowerCase()}`
          : `${
              inputGroup.count - inputGroup.excluded.length
            } ${inputGroup.label?.toLocaleLowerCase()} cadastrados`}
      </Button>
    </>
  );
};

export default InputGroupContent;
