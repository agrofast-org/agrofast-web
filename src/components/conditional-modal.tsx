import { useEffect, useState } from "react";
import { Modal, ModalContent } from "./modal";
import { ModalProps } from "@heroui/react";

export interface ConditionalModalProps extends ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canClose?: boolean;
}

const ConditionalModal: React.FC<ConditionalModalProps> = ({
  isOpen,
  onClose,
  canClose = true,
  children,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(isOpen);

  const handleClose = () => {
    if (!canClose) return;
    setIsModalOpen(false);
    onClose?.();
  };

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleClose}
      hideCloseButton={!canClose}
      placement="center"
      {...props}
    >
      <ModalContent>
        {children}
      </ModalContent>
    </Modal>
  );
};

export default ConditionalModal;
