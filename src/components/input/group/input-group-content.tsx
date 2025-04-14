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
  const inputGroup = useGroup();
  if (!inputGroup) {
    return null;
  }

  const {
    disclosure: { isOpen, onOpen, onOpenChange, onClose: onCloseModal },
  } = inputGroup;
  const onClose = () => {
    onCloseModal();
  };

  return (
    <>
      {inputGroup.modal ? (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
          <ModalContent>
            <ModalHeader>{inputGroup.label}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Fechar</Button>
              <Button
                confirmAction
                color="primary"
                onPress={() => {
                  if (inputGroup.edit !== undefined) {
                    inputGroup.handleEditConfirm();
                    return;
                  }
                  inputGroup.addNew();
                }}
              >
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        children
      )}
      {(inputGroup.list ||
        (!inputGroup.list &&
          inputGroup.count - inputGroup.excluded.length <= 0)) && (
        <Button
          variant="flat"
          className="bg-default-100 hover:bg-default-200 shadow-sm duration-100"
          onPress={() => {
            onOpen();
          }}
          disabled={
            inputGroup.max &&
            inputGroup.count - inputGroup.excluded.length >= inputGroup.max
              ? true
              : false
          }
        >
          {/* TODO: internationalize here */}
          {inputGroup.count - inputGroup.excluded.length <= 0
            ? `Cadastrar um ${inputGroup.label?.toLocaleLowerCase()}`
            : `${
                inputGroup.count - inputGroup.excluded.length
              } ${inputGroup.label?.toLocaleLowerCase()} cadastrados`}
        </Button>
      )}
    </>
  );
};

export default InputGroupContent;
