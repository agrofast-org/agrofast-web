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
import { useDebounce } from "@/hooks/use-debounce";

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

  const {
    data: asyncList,
    isFetching: isAsyncListLoading,
    refetch: reloadAsyncList,
  } = useQuery({
    queryKey: ["async-options", name],
    queryFn: async () => {
      return await api
        .get<Options>(props.src || "", {
          params: {
            q: list.filterText,
          },
        })
        .then((res) => res.data)
        .catch(() => null);
    },
    enabled: false, // !!props.src && list.filterText.trim() !== "" && !list.isLoading,
  });

  const [debounce] = useDebounce(() => {
    if (list.filterText.trim() !== "") {
      reloadAsyncList();
    }
  }, 1500);

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
      const asyncOption = (Array.isArray(asyncList) ? asyncList : [])?.find(
        (item) => item.value === key?.toString()
      );
      if (asyncOption) {
        onAsyncSelect?.(asyncOption);
      }
      onSelectionChange?.(key);
      return onSelectionChange;
    },
    ignoreForm: !name,
    error: props.errorMessage,
  });

  const headingClasses =
    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small";

  return (
    <HeroUIAutocomplete
      aria-label="Autocomplete"
      labelPlacement="outside"
      variant="bordered"
      isLoading={list.isLoading}
      inputValue={list.filterText}
      onInputChange={(val) => {
        if (val.trim() !== "") {
          debounce();
        }
        list.setFilterText(val);
      }}
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
        {list.items.length > 0 ? (
          list.items.map((item) => {
            const opt = item as Option;
            return (
              <HeroUIAutocompleteItem
                startContent={
                  opt.image ? (
                    <Avatar
                      src={opt.image}
                      className="w-10 h-[35px] !aspect-square"
                    />
                  ) : undefined
                }
                key={opt.value}
                description={opt.description}
              >
                {opt.label}
              </HeroUIAutocompleteItem>
            );
          })
        ) : (
          <HeroUIAutocompleteItem key="local-fallback" isDisabled>
            Nenhuma opção disponível
          </HeroUIAutocompleteItem>
        )}
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
        ) : !Array.isArray(asyncList) ? (
          <HeroUIAutocompleteItem key="no-options" isDisabled>
            Nenhuma opção disponível
          </HeroUIAutocompleteItem>
        ) : (
          (Array.isArray(asyncList) ? asyncList : [])?.map((item) => {
            const opt = item as Option;
            return (
              <HeroUIAutocompleteItem
                startContent={
                  opt.image ? (
                    <Avatar
                      src={opt.image}
                      className="w-10 h-[35px] !aspect-square"
                    />
                  ) : undefined
                }
                key={opt.value}
                description={opt.description}
              >
                {opt.label || "Unnamed Option"}
              </HeroUIAutocompleteItem>
            );
          })
        )}
      </AutocompleteSection>
    </HeroUIAutocomplete>
  );
};

export const AutocompleteItem = HeroUIAutocompleteItem;
