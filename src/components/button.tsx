import {
  Button as HeroUIButton,
  ButtonProps as HeroUIButtonProps,
  useDisclosure,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/modal";
import { cn } from "@/lib/utils";

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
  className,
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
        onPress: onOpen,
      }
    : {};

  return (
    <>
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
        className={cn("px-8", className)}
        type={confirmAction ? "button" : type}
      >
        {children}
      </HeroUIButton>
    </>
  );
};

export default Button;
