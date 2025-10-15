"use client";
import { useForm } from "@/components/form/form";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useEffect, useId, useState, useCallback } from "react";

export interface UseFieldProps<T, S = (value: T) => void> {
  id?: string;
  name?: string;
  value?: T;
  onChange?: S | ((newValue: T) => void);
  onBlur?: () => void;
  ignoreForm?: boolean;
  error?: ValidationError | undefined;
}

export const useField = <T = string, S = (value: T) => void>({
  id,
  name,
  value,
  onChange,
  onBlur,
  ignoreForm = false,
  error,
}: UseFieldProps<T, S>) => {
  const reactId = useId();

  const form = useForm();
  const [prevValue, setPrevValue] = useState<T | undefined>(value);
  const [inputValue, setInputValue] = useState<T | undefined>(value);
  const [inputError, setInputError] = useState<ValidationError | undefined>(
    error
  );

  const handleChange = useCallback(
    (newValue: T) => {
      setInputValue(newValue);
      if (typeof onChange === "function") {
        (onChange as (newValue: T) => void)(newValue);
      }
      if (name && form && !ignoreForm) {
        form.setValue(name, newValue);
      }
    },
    [name, ignoreForm, form, onChange]
  );

  const handleBlur = useCallback(() => {
    if (inputValue === prevValue) {
      return;
    }
    onBlur?.();
    setPrevValue(inputValue);
    if (!ignoreForm && form && name && form.values[name] !== inputValue) {
      form.setValue(name, inputValue);
      form.setError(name, undefined);
    }
  }, [ignoreForm, name, inputValue, prevValue, form, onBlur]);

  useEffect(() => {
    if (form && !ignoreForm) {
      const formValue = form.values[name || reactId];
      setInputValue(formValue);
    }
  }, [ignoreForm, name, form, reactId, inputValue]);

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
    onBlur: handleBlur,
    error: inputError,
  };
};
