"use client";
import {
  InputProps as HeroUIInputProps,
  Input as HeroUIInput,
  cn,
} from "@heroui/react";
import { useRef, useState } from "react";
import { PasswordVisibilityToggle } from "../ux/password-visibility-toggle";
import { useField } from "@/hooks/use-field";

export interface InputProps extends HeroUIInputProps {
  taggableVisibility?: boolean;
}

export const Input: React.FC<InputProps> = ({
  className,
  taggableVisibility,
  isDisabled,
  ...props
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const field = useField<string>({
    id: props.id,
    name: props.name,
    value: props.value,
    onChange: (newValue) => {
      props.onValueChange?.(newValue);
    },
    ignoreForm: !props.name,
    error: props.errorMessage,
  });

  const [isPassVisible, setIsPassVisible] = useState(false);
  const togglePassVisibility = () => setIsPassVisible((prev) => !prev);

  return (
    <HeroUIInput
      ref={ref}
      classNames={{
        base: "!relative",
        label: "!top-6 !-translate-y-[3.25em] start-0 text-foreground",
        helperWrapper: "!absolute !-bottom-[20px] !-left-0.5 max-w-full",
        errorMessage: "!truncate",
        input: "!transition-colors !duration-100",
        inputWrapper: "!transition-colors !duration-100",
      }}
      labelPlacement="outside"
      variant="bordered"
      className={cn(
        "text-gray-700 dark:text-gray-200 transition-colors duration-100",
        className,
        isDisabled && "opacity-50 pointer-events-none"
      )}
      endContent={
        taggableVisibility &&
        props.type === "password" && (
          <PasswordVisibilityToggle
            isPassVisible={isPassVisible}
            togglePassVisibility={() => {
              ref.current?.focus();
              togglePassVisibility();
            }}
          />
        )
      }
      {...props}
      id={field.id}
      name={field.name}
      value={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={field.error}
      type={isPassVisible ? "text" : props.type}
      disabled={isDisabled}
      isDisabled={isDisabled}
    />
  );
};
