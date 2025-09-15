"use client";
import { useForm } from "@/components/form/form";
import { SelectProps } from "@heroui/react";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useEffect, useId, useState, useCallback, Key } from "react";

export interface UseSelectProps {
  id?: string;
  name?: string;
  value?: SelectProps["selectedKeys"];
  onChange?: SelectProps["onSelectionChange"];
  ignoreForm?: boolean;
  error?: ValidationError | undefined;
}

export const useSelect = ({
  id,
  name,
  value,
  onChange,
  ignoreForm = false,
  error,
}: UseSelectProps) => {
  const reactId = useId();

  const form = useForm();
  const [inputValue, setInputValue] = useState<SelectProps["selectedKeys"]>(
    new Set(value || [])
  );
  const [inputError, setInputError] = useState<ValidationError | undefined>(
    error
  );

  const handleChange = useCallback(
    (newValue: SelectProps["selectedKeys"]) => {
      setInputValue(newValue);
      setInputError(undefined);
      onChange?.(new Set(newValue));
      if (name && form && !ignoreForm) {
        const valueToSet = newValue === "all" ? newValue : Array.from(newValue || []);
        form.setValue(name, valueToSet);
      }
    },
    [name, ignoreForm, form, onChange]
  );

  useEffect(() => {
    if (form && !ignoreForm) {
      const formValue = form.values[name || reactId];
      let newSet: Set<Key>;
      if (typeof formValue === "string") {
        newSet = new Set(formValue.split(",").filter(Boolean));
      } else {
        newSet = new Set(formValue);
      }
      setInputValue(newSet as unknown as SelectProps["selectedKeys"]);
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
