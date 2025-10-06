import { useState } from "react";
import { Form, FormProps } from "./form/form";
import { cn, Spinner } from "@heroui/react";
import { AxiosError, AxiosResponse } from "axios";
import { FormErrors } from "@/types/form";

export type RequestFormProps<
  TSuccess extends AxiosResponse = AxiosResponse,
  TError extends AxiosError = AxiosError
> = {
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onSubmit?: (data?: FormData) => Promise<TSuccess | void>;
  onSuccess?: (data: TSuccess) => void;
  onError?: (error: TError) => void;
} & Omit<FormProps, "onSubmit" | "children" | "className">;

export function RequestForm<
  TSuccess extends AxiosResponse = AxiosResponse,
  TError extends AxiosError = AxiosError
>({
  children,
  className,
  isLoading,
  onSubmit,
  onSuccess,
  onError,
  ...props
}: RequestFormProps<TSuccess, TError>) {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors | undefined>(
    undefined
  );
  const [, setFormError] = useState<string | undefined>(undefined);

  return (
    <Form
      className={cn("relative transition-opacity", className, {
        "*:pointer-events-none *:opacity-40": formLoading || isLoading,
      })}
      validationErrors={formErrors}
      onSubmit={(formData) => {
        setFormLoading(true);
        onSubmit?.(formData)
          .then((response) => {
            if (response) {
              onSuccess?.(response);
            }
          })
          .catch((error) => {
            setFormError(error.response?.data?.message);
            setFormErrors(error.response?.data?.errors);
            onError?.(error);
          })
          .finally(() => {
            setFormLoading(false);
          });
      }}
      {...props}
    >
      {children}
      <Spinner
        size="lg"
        color="current"
        className={cn({
          "absolute inset-0 opacity-0 pointer-events-none transition-opacity":
            true,
          "!opacity-100": formLoading || isLoading,
        })}
      />
    </Form>
  );
}
