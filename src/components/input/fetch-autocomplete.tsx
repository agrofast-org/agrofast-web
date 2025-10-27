"use client";
import {
  Autocomplete as HeroUIAutocomplete,
  AutocompleteProps as HeroUIAutocompleteProps,
  AutocompleteItem as HeroUIAutocompleteItem,
  cn,
  AutocompleteSection,
  Spinner,
} from "@heroui/react";
import { Option, Options } from "@/types/options";
import { useAsyncList } from "@react-stately/data";
import { useAutocomplete } from "@/hooks/use-autocomplete";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/service/api";
import { Avatar } from "../avatar";

export type FetchAutocompleteProps = {
  localLabel: string;
  asyncLabel: string;
  onAsyncSelect?: (option: Option | null) => void;
  src?: string;
  options?: Options;
  children?: HeroUIAutocompleteProps["children"];
} & Omit<HeroUIAutocompleteProps, "items" | "children" | "inputValue">;

export const FetchAutocomplete: React.FC<FetchAutocompleteProps> = ({
  name,
  options,
  localLabel,
  asyncLabel,
  onAsyncSelect,
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

  const { data: asyncList, isFetching: isAsyncListLoading } = useQuery({
    queryKey: ["async-options", name],
    queryFn: async () => {
      return await api
        .get<Options>(props.src || "", {
          params: {
            query: list.filterText,
          },
        })
        .then((res) => res.data);
    },
    enabled: !!props.src && list.filterText.trim() !== "" && !list.isLoading,
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
    onChange: (key) => {
      const asyncOption = asyncList?.find((item) => item.value === key);
      if (asyncOption) {
        onAsyncSelect?.(asyncOption);
      }
      return onSelectionChange;
    },
    ignoreForm: !name,
    error: props.errorMessage,
  });

  const headingClasses =
    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

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
      <AutocompleteSection
        classNames={{
          heading: headingClasses,
        }}
        title={localLabel || "Opções"}
      >
        {(item) => {
          const opt = item as Option;
          return (
            <HeroUIAutocompleteItem
              key={opt.value}
              description={opt.description}
            >
              {opt.label}
            </HeroUIAutocompleteItem>
          );
        }}
      </AutocompleteSection>
      <AutocompleteSection
        classNames={{
          heading: headingClasses,
        }}
        title={asyncLabel || "Opções carregadas"}
      >
        {isAsyncListLoading ? (
          <HeroUIAutocompleteItem key="loading" isReadOnly>
            <Spinner
              size="sm"
              classNames={{
                circle1: "!border-b-default-600",
                circle2: "!border-b-default-600",
              }}
            />
            Carregando...
          </HeroUIAutocompleteItem>
        ) : asyncList && asyncList.length === 0 ? (
          <HeroUIAutocompleteItem key="no-options">
            No options available
          </HeroUIAutocompleteItem>
        ) : (
          asyncList?.map((item) => {
            const opt = item as Option;
            return (
              <HeroUIAutocompleteItem
                startContent={
                  opt.image ? undefined : <Avatar src={opt.image} />
                }
                key={opt.value}
                description={opt.description}
              >
                {opt.label || "Unnamed Option"}
              </HeroUIAutocompleteItem>
            );
          }) ?? (
            <HeroUIAutocompleteItem key="fallback">
              Nenhuma opção disponível
            </HeroUIAutocompleteItem>
          )
        )}
      </AutocompleteSection>
    </HeroUIAutocomplete>
  );
};

export const AutocompleteItem = HeroUIAutocompleteItem;
