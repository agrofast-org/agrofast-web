"use client";
import { useForm } from "@/components/form/form";
import { AutocompleteProps } from "@heroui/react";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useEffect, useId, useState, useCallback } from "react";

export interface UseAutocompleteProps {
  id?: string;
  name?: string;
  value?: AutocompleteProps["selectedKey"];
  onChange?: AutocompleteProps["onSelectionChange"];
  ignoreForm?: boolean;
  error?: ValidationError | undefined;
}

export const useAutocomplete = ({
  id,
  name,
  value,
  onChange,
  ignoreForm = false,
  error,
}: UseAutocompleteProps) => {
  const reactId = useId();

  const form = useForm();
  const [inputValue, setInputValue] =
    useState<AutocompleteProps["selectedKey"]>(value);
  const [inputError, setInputError] = useState<ValidationError | undefined>(
    error
  );

  const handleChange = useCallback(
    (newValue: AutocompleteProps["selectedKey"]) => {
      setInputValue(newValue);
      setInputError(undefined);
      onChange?.(newValue ?? null);
      if (name && form && !ignoreForm) {
        form.setValue(name, newValue);
      }
    },
    [name, ignoreForm, form, onChange]
  );

  useEffect(() => {
    if (form && !ignoreForm) {
      const formValue = form.values[name || reactId];
      setInputValue(formValue);
    }
  }, [ignoreForm, name, form, reactId, form?.values]);

  useEffect(() => {
    if (form && !ignoreForm) {
      const formError = form.errors[name || reactId];
      if (formError !== undefined && formError !== inputError) {
        setInputError(formError);
      }
    }
  }, [ignoreForm, name, form, reactId, inputError]);

  return {
    id: id || reactId,
    name: name,
    value: inputValue,
    onChange: handleChange,
    error: inputError,
  };
};
