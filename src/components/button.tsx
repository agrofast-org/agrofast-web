import {
  Button as HeroUIButton,
  ButtonProps as HeroUIButtonProps,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";

export type HrefProps = {
  pathname: string;
  query?: Record<string, string | number>;
};

export interface ButtonProps extends HeroUIButtonProps {
  confirmAction?: boolean;
  actionConfirmTitle?: string;
  actionConfirmText?: string;
  actionConfirmButtonLabel?: string;
  actionCancelButtonLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type,
  confirmAction = false,
  actionConfirmTitle,
  actionConfirmText,
  actionCancelButtonLabel,
  actionConfirmButtonLabel,
  ...props
}: ButtonProps) => {
  const t = useTranslations();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const newProps = confirmAction
    ? {
        type: "button",
        onClick: onOpen,
      }
    : {};

  return (
    <div>
      {confirmAction && (
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
                  <HeroUIButton onPress={onClose}>
                    {actionCancelButtonLabel ?? t("UI.buttons.cancel")}
                  </HeroUIButton>
                  <HeroUIButton
                    {...props}
                    type={type}
                    onPress={() => {
                      onClose();
                      document.querySelector("form")?.requestSubmit();
                    }}
                  >
                    {actionConfirmButtonLabel ?? t("UI.buttons.continue")}
                  </HeroUIButton>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <HeroUIButton
        {...props}
        {...newProps}
        type={confirmAction ? "button" : type}
      >
        {children}
      </HeroUIButton>
    </div>
  );
};

export default Button;
