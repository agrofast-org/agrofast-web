import { cn } from "@/lib/utils";
import React, { JSX } from "react";
import { IconSvgObject } from "@/types/hugeicons";
import Icon from "../icon";
import { useDisclosure } from "@heroui/react";
import ConfirmActionModal, {
  ConfirmActionModalMessages,
} from "../ux/confirm-action-modal";

export type OptionIcon = IconSvgObject;

export interface IconOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: OptionIcon | JSX.Element;
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
