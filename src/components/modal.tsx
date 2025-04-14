import { cn } from "@/lib/utils";
import {
  Modal as HeroUIModal,
  ModalProps as HeroUIModalProps,
  ModalContent as HeroUIModalContent,
  ModalContentProps as HeroUIModalContentProps,
  ModalHeader as HeroUIModalHeader,
  ModalHeaderProps as HeroUIModalHeaderProps,
  ModalBody as HeroUIModalBody,
  ModalBodyProps as HeroUIModalBodyProps,
  ModalFooter as HeroUIModalFooter,
  ModalFooterProps as HeroUIModalFooterProps,
} from "@heroui/react";

export const Modal: React.FC<HeroUIModalProps> = ({ className, ...props }) => {
  return (
    <HeroUIModal
      className={cn("text-gray-700 dark:text-gray-200", className)}
      {...props}
    />
  );
};

export const ModalContent: React.FC<HeroUIModalContentProps> = ({
  ...props
}) => {
  return <HeroUIModalContent {...props} />;
};

export const ModalHeader: React.FC<HeroUIModalHeaderProps> = ({
  className,
  ...props
}) => {
  return (
    <HeroUIModalHeader
      className={cn("justify-between px-4 pt-2 pb-1", className)}
      {...props}
    />
  );
};

export const ModalBody: React.FC<HeroUIModalBodyProps> = ({
  className,
  ...props
}) => {
  return (
    <HeroUIModalBody className={cn("px-4 pt-2 pb-1", className)} {...props} />
  );
};

export const ModalFooter: React.FC<HeroUIModalFooterProps> = ({
  className,
  ...props
}) => {
  return <HeroUIModalFooter className={cn("justify-between px-4 pt-2", className)} {...props} />;
};
