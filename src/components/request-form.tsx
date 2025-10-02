import { useState } from "react";
import { Form } from "./form/form";
import { cn } from "@heroui/react";
import { AxiosResponse } from "axios";
import { FormErrors } from "@/types/form";

export interface RequestFormProps<TSuccess extends AxiosResponse = AxiosResponse, TError extends FormErrors = FormErrors> {
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onSubmit?: (data?: FormData) => Promise<TSuccess | void>;
  onSuccess?: (data: TSuccess) => void;
  onError?: (error: TError) => void;
}

export function RequestForm<TSuccess extends AxiosResponse = AxiosResponse, TError extends FormErrors = FormErrors>({
  children,
  className,
  isLoading,
  onSubmit,
  onSuccess,
  onError,
}: RequestFormProps<TSuccess, TError>) {
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<TError | undefined>(undefined);

  return (
    <Form
      className={cn(
        "relative",
        {
          "pointer-events-none opacity-60": formLoading || isLoading,
        },
        className
      )}
      validationErrors={formError}
      onSubmit={(formData) => {
        setFormLoading(true);
        onSubmit?.(formData)
          .then((response) => {
            if (response) {
              onSuccess?.(response);
            }
          })
          .catch((error) => {
            setFormError(error as TError);
            onError?.(error as TError);
          })
          .finally(() => {
            setFormLoading(false);
          });
      }}
    >
      {children}
    </Form>
  );
}
