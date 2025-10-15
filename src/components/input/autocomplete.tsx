"use client";
import {
  Autocomplete as HeroUIAutocomplete,
  AutocompleteProps as HeroUIAutocompleteProps,
  AutocompleteItem as HeroUIAutocompleteItem,
  cn,
} from "@heroui/react";
import { Option, Options } from "@/types/options";
import { useAsyncList } from "@react-stately/data";
import { useAutocomplete } from "@/hooks/use-autocomplete";
import { useCallback } from "react";

export type AutocompleteProps = {
  options?: Options;
  children?: HeroUIAutocompleteProps["children"];
} & Omit<HeroUIAutocompleteProps, "items" | "children" | "inputValue">;

export const Autocomplete: React.FC<AutocompleteProps> = ({
  name,
  options,
  className,
  required,
  onSelectionChange,
  isRequired,
  ...props
}) => {
  const isFieldRequired = required ?? isRequired ?? false;

  const list = useAsyncList<Option>({
    load: async ({ filterText }) => {
      if (!filterText) {
        return { items: options ?? [] };
      }
      return {
        items:
          options?.filter(
            (item) =>
              item.label.toLowerCase().includes(filterText.toLowerCase()) ||
              (item.description &&
                item.description
                  .toLowerCase()
                  .includes(filterText.toLowerCase()))
          ) ?? [],
      };
    },
  });

  const updateInput = useCallback(
    (key: React.Key | null) => {
      if (key === null) {
        list.setFilterText("");
        return;
      }
      const selectedOption = options?.find((item) => item.value === key);
      if (selectedOption) {
        list.setFilterText(selectedOption.label);
      } else {
        list.setFilterText("");
      }
    },
    [options, list]
  );

  const field = useAutocomplete({
    id: props.id,
    name,
    value: props.selectedKey,
    onChange: onSelectionChange,
    ignoreForm: !name,
    error: props.errorMessage,
  });

  return (
    <HeroUIAutocomplete
      labelPlacement="outside"
      variant="bordered"
      isLoading={list.isLoading}
      inputValue={list.filterText}
      onInputChange={list.setFilterText}
      items={list.items}
      classNames={{
        base: "relative max-h-10 mb-6",
        listbox: "!transition-colors !duration-100",
        listboxWrapper: "!transition-colors !duration-100",
      }}
      className={cn("transition-colors duration-100 autocomplete", className)}
      isRequired={isFieldRequired}
      id={field.id}
      name={field.name}
      selectedKey={field.value}
      onSelectionChange={(key) => {
        field.onChange(key);
        updateInput(key);
      }}
      errorMessage={field.error}
      {...props}
    >
      {(item) => {
        const opt = item as Option;
        return (
          <HeroUIAutocompleteItem key={opt.value} description={opt.description}>
            {opt.label}
          </HeroUIAutocompleteItem>
        );
      }}
    </HeroUIAutocomplete>
  );
};

export const AutocompleteItem = HeroUIAutocompleteItem;
