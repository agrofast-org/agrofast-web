import { cn } from "@/lib/utils";
import React, { JSX } from "react";
import { IconSvgObject } from "@/types/hugeicons";
import Icon from "../icon";
import { useDisclosure } from "@heroui/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../modal";
import Button from "../button";
import { useTranslations } from "next-intl";

export type OptionIcon = IconSvgObject;

export interface IconOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: OptionIcon | JSX.Element;
  confirmAction?: boolean;
  actionConfirmTitle?: string;
  actionConfirmText?: string;
  actionConfirmButtonLabel?: string;
  actionCancelButtonLabel?: string;
  onClick?: () => void;
}

const IconOption: React.FC<IconOptionProps> = ({
  icon,
  className,
  children,
  confirmAction = false,
  actionConfirmTitle,
  actionConfirmText,
  actionCancelButtonLabel,
  actionConfirmButtonLabel,
  onClick,
  ...props
}) => {
  const t = useTranslations();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const newProps = confirmAction
    ? {
        onClick: () => {
          onOpen();
        },
      }
    : {
        onClick: () => {
          onClick?.();
        },
      };

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
                  <Button onPress={onClose}>
                    {actionCancelButtonLabel ?? t("UI.buttons.cancel")}
                  </Button>
                  <Button
                    onPress={() => {
                      onClick?.();
                      onClose();
                    }}
                  >
                    {actionConfirmButtonLabel ?? t("UI.buttons.continue")}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
      <div
        className={cn(
          "flex flex-row items-center gap-2 bg-default-100 bg-opacity-0 hover:bg-opacity-75 p-1 rounded-md w-full text-gray-700 dark:text-gray-200 duration-75 cursor-pointer",
          className
        )}
        {...props}
        {...newProps}
      >
        {icon && (
          <span className="flex justify-center items-center w-4 h-4 font-medium text-gray-700 dark:text-gray-200">
            {React.isValidElement(icon) ? (
              icon
            ) : (
              <Icon icon={icon as IconSvgObject} />
            )}
          </span>
        )}
        {children}
      </div>
    </>
  );
};

export default IconOption;
