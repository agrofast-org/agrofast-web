import { cn } from "@/lib/utils";
import React, { JSX } from "react";
import { IconSvgObject } from "@/types/hugeicons";
import { useDisclosure } from "@heroui/react";
import ConfirmActionModal, {
  ConfirmActionModalMessages,
} from "../ux/confirm-action-modal";

export type OptionIcon = IconSvgObject;

export interface IconOptionProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: JSX.Element;
  confirmAction?: boolean;
  confirmActionInfo?: ConfirmActionModalMessages;
  onClick?: () => void;
}

const IconOption: React.FC<IconOptionProps> = ({
  icon,
  className,
  children,
  confirmAction = false,
  confirmActionInfo,
  onClick,
  ...props
}) => {
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
        <ConfirmActionModal
          isOpen={isOpen}
          onClose={onClose}
          onClick={onClick}
          {...confirmActionInfo}
        />
      )}
      <button
        className={cn(
          "flex flex-row items-center gap-1.5 bg-default-100 bg-opacity-0 hover:bg-opacity-75 p-1 rounded-md w-full text-gray-700 dark:text-gray-200 duration-75 cursor-pointer",
          "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1 -outline-offset-1",
          className
        )}
        {...props}
        {...newProps}
      >
        {icon && (
          <span className="flex justify-center items-center w-4 h-4 font-medium text-gray-700 dark:text-gray-200">
            {icon}
          </span>
        )}
        {children}
      </button>
    </>
  );
};

export default IconOption;
