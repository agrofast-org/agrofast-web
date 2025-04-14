import { PressEvent } from "@heroui/react";
import Button, { ButtonProps } from "../button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import { useTranslations } from "next-intl";

export interface ConfirmActionModalMessages {
  actionConfirmTitle?: string;
  actionConfirmButton?: string;
  actionCancelButton?: string;
  actionConfirmButtonColor?: ButtonProps["color"];
  actionConfirmText?: string;
}

export interface ConfirmActionModalProps extends ConfirmActionModalMessages {
  isOpen: boolean;
  onClose: () => void;
  onClick?: (e: PressEvent) => void;
}

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onClick,
  actionConfirmTitle,
  actionConfirmText,
  actionConfirmButton,
  actionCancelButton,
  actionConfirmButtonColor,
}) => {
  const t = useTranslations();

  return (
    <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose}>
      <ModalContent className="m-1 md:m-0 max-h-[calc(100vh-8px)] md:max-h-[calc(100vh-4rem)]">
        {(onClose) => (
          <>
            <ModalHeader>
              {actionConfirmTitle ?? t("UI.titles.action_confirm")}
            </ModalHeader>
            <ModalBody>
              {actionConfirmText ?? t("UI.titles.action_confirm_text")}
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>
                {actionConfirmButton ?? t("UI.buttons.cancel")}
              </Button>
              <Button
                onPress={(e) => {
                  onClick?.(e);
                  onClose();
                }}
                color={actionConfirmButtonColor}
              >
                {actionCancelButton ?? t("UI.buttons.continue")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmActionModal;
