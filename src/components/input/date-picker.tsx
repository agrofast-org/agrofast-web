"use client";
import React, { useCallback, useEffect, useId, useState } from "react";
import {
  cn,
  DatePicker as HeroUIDatePicker,
  DatePickerProps as HeroUIDatePickerProps,
} from "@heroui/react";
import { useForm } from "../form/form";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { parseDate } from "@internationalized/date";
export type DatePickerValue = HeroUIDatePickerProps["value"];

export interface DatePickerProps extends HeroUIDatePickerProps {
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  name,
  value,
  errorMessage,
  onChange,
  className,
  ...props
}) => {
  const reactId = useId();

  const form = useForm();
  const [inputValue, setInputValue] = useState(value);
  const [inputError, setInputError] = useState<ValidationError | undefined>(
    errorMessage
  );

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newValue: any) => {
      setInputValue(newValue);
      setInputError(undefined);
      onChange?.(newValue ?? null);
      if (name && form) {
        form.setValue(name, newValue);
      }
    },
    [name, form, onChange]
  );

  useEffect(() => {
    if (form) {
      const formValue = form.values[name || reactId];
      if (typeof formValue === "string") {
        setInputValue(parseDate(formValue));
      } else {
        setInputValue(formValue);
      }
    }
  }, [name, form, reactId, form?.values]);

  useEffect(() => {
    if (form) {
      const formError = form.errors[name || reactId];
      if (formError !== undefined && formError !== inputError) {
        setInputError(formError);
      }
    }
  }, [name, form, reactId, inputError]);

  return (
    <HeroUIDatePicker
      id={props.id || reactId}
      name={name || reactId}
      className={cn("w-full", className)}
      classNames={{
        base: "relative gap-1 !pb-0",
        label: "top-6 !translate-y-[0.30em] w-max pr-2",
        helperWrapper: "absolute -bottom-[20px] -left-0.5 min-w-max p-0",
        input: "!transition-colors !duration-100 ",
        inputWrapper: "!transition-colors !duration-100",
        selectorButton: "rounded-lg left-0.5",
      }}
      labelPlacement="outside"
      variant="bordered"
      {...props}
      value={inputValue}
      onChange={handleChange}
      errorMessage={inputError}
    />
  );
};
