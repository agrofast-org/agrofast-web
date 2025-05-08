import { cn } from "@/lib/utils";
import React, { JSX, useEffect, useState } from "react";
import { IconSvgObject } from "@/types/hugeicons";
import { Button, useDisclosure } from "@heroui/react";
import ConfirmActionModal, {
  ConfirmActionModalMessages,
} from "../ux/confirm-action-modal";
import Link, { formatLink, HrefProps } from "../link";
import { useRouter } from "next/router";

export type OptionIcon = IconSvgObject;

export interface IconOptionProps {
  icon?: JSX.Element;
  href?: string | HrefProps;
  className?: string;
  children?: React.ReactNode;
  confirmAction?: boolean;
  confirmActionInfo?: ConfirmActionModalMessages;
  onClick?: () => void;
}

const IconOption: React.FC<IconOptionProps> = ({
  icon,
  href,
  className,
  children,
  confirmAction = false,
  confirmActionInfo,
  onClick,
  ...props
}) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formattedHref, setFormattedHref] = useState<string | undefined>(
    undefined
  );

  const newProps = confirmAction
    ? {
        onClick: () => {
          onOpen();
        },
      }
    : {
        onClick: () => {
          onClick?.();
          if (formattedHref) {
            router.push(formattedHref);
          }
        },
      };

  useEffect(() => {
    if (href !== undefined) {
      if (typeof href === "string") {
        setFormattedHref(href);
      } else {
        setFormattedHref(formatLink(href));
      }
    }
  }, [href]);

  const linkProps = formattedHref ? { href: formattedHref, as: Link } : {};

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
      <Button
        className={cn(
          "flex flex-row justify-start items-center gap-1.5 bg-default-100 bg-opacity-0 hover:bg-opacity-85 p-1 rounded-md w-full text-gray-700 dark:text-gray-200 text-sm duration-75 cursor-pointer",
          "focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1 -outline-offset-1",
          className
        )}
        size="sm"
        {...props}
        {...newProps}
        {...linkProps}
      >
        {icon && (
          <span className="flex justify-center items-center size-[18px] font-medium text-gray-700 dark:text-gray-200">
            {icon}
          </span>
        )}
        {children}
      </Button>
    </>
  );
};

export default IconOption;
