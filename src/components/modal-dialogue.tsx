import { ModalProps } from "@heroui/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "./modal";
import { Button } from "./button";

export interface ModalDialogueProps extends ModalProps {
  title?: string;
  action?: () => void;
  actionMessage?: string;
  dismiss?: () => void;
  dismissMessage?: string;
}

export const ModalDialogue: React.FC<ModalDialogueProps> = ({
  title,
  action,
  actionMessage,
  dismiss,
  dismissMessage,
  children,
  className,
  ...props
}) => {
  return (
    <Modal {...props}>
      <ModalContent>
        <ModalHeader>{title ?? "Alert"}</ModalHeader>
        <ModalBody className={className}>{children}</ModalBody>
        <ModalFooter className="flex-row-reverse">
          {action && (
            <Button color="primary" onPress={action}>
              {actionMessage ?? "Action"}
            </Button>
          )}
          <Button
            onPress={() => {
              props?.onClose?.();
              dismiss?.();
            }}
          >
            {dismissMessage ?? "Dismiss"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
