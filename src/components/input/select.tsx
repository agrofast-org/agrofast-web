"use client";

import {
  SelectProps as HeroUISelectProps,
  Select as HeroUISelect,
  SelectItem as HeroUISelectItem,
  cn,
} from "@heroui/react";
import { Options } from "@/types/options";
import { useSelect } from "@/hooks/use-select";

export type SelectProps = {
  children?: HeroUISelectProps["children"];
  options?: Options;
} & Omit<HeroUISelectProps, "children">;

export const Select: React.FC<SelectProps> = ({
  name,
  className,
  options,
  disabled,
  children,
  multiple,
  onSelectionChange,
  ...props
}) => {
  const field = useSelect({
    id: props.id,
    name,
    value: props.selectedKeys,
    onChange: onSelectionChange,
    ignoreForm: !name,
    error: props.errorMessage,
  });

  return (
    <HeroUISelect
      classNames={{
        base: "relative max-h-10",
        label: "top-6 !-translate-y-[3.10em] text-foreground",
        helperWrapper: "absolute -bottom-[20px] -left-0.5 max-w-full",
        errorMessage: "truncate",
        listbox: "!transition-colors !duration-100 ",
        listboxWrapper: "!transition-colors !duration-100",
      }}
      labelPlacement="outside"
      variant="bordered"
      className={cn(
        "text-gray-700 dark:text-gray-200 transition-colors duration-100 select",
        className,
        disabled && "opacity-50 pointer-events-none"
      )}
      {...props}
      selectionMode={multiple ? "multiple" : "single"}
      id={field.id}
      name={field.name}
      selectedKeys={field.value}
      onSelectionChange={field.onChange}
      errorMessage={field.error}
    >
      {options
        ? options.map((option) => (
            <HeroUISelectItem
              key={option.value}
              textValue={option.label}
              description={option.description}
            >
              {option.label}
            </HeroUISelectItem>
          ))
        : children ?? null}
    </HeroUISelect>
  );
};

export const SelectItem = HeroUISelectItem;
