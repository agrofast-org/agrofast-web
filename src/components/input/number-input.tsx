"use client";
import {
  cn,
  NumberInputProps as HeroUINumberInputProps,
  NumberInput as HeroUINumberInput,
} from "@heroui/react";
import { useField } from "@/hooks/use-field";

export interface NumberInputProps extends HeroUINumberInputProps {
  className?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  name,
  className,
  disabled,
  onValueChange,
  ...props
}) => {
  const field = useField<number>({
    id: props.id,
    name,
    value: props.value,
    onChange: (newValue) => {
      if (onValueChange) {
        onValueChange(newValue);
      }
    },
    ignoreForm: !name,
    error: props.errorMessage,
  });

  return (
    <HeroUINumberInput
      classNames={{
        base: "!relative",
        label: "!top-6 !-translate-y-[3.25em] start-0",
        helperWrapper: "!absolute !-bottom-[24px] !-left-0.5 max-w-full",
        errorMessage: "!truncate",
        input: "!transition-colors !duration-100",
        inputWrapper: "!transition-colors !duration-100 shadow-xs",
      }}
      labelPlacement="outside"
      variant="bordered"
      className={cn(
        "text-gray-700 dark:text-gray-200 transition-colors duration-100",
        className,
        disabled && "opacity-50 pointer-events-none"
      )}
      {...props}
      id={field.id}
      name={field.name}
      value={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      errorMessage={field.error}
      disabled={disabled}
    />
  );
};
