import { useState } from "react";
import { Form, FormProps } from "./form/form";
import { cn, Spinner } from "@heroui/react";
import { AxiosError, AxiosResponse } from "axios";
import { FormErrors, FormValues } from "@/types/form";
import { useLoadingDisclosure } from "@/hooks/use-loading-disclosure";
import { useToast } from "@/service/toast";

export type RequestFormProps<
  TSuccess extends AxiosResponse = AxiosResponse,
  TError extends AxiosError = AxiosError
> = {
  children?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  onSubmit?: (data?: FormData | FormValues) => Promise<TSuccess | void>;
  onSuccess?: (data: TSuccess) => void;
  onError?: (error: TError) => void;
  loadingDisclosure?: ReturnType<typeof useLoadingDisclosure>;
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
  loadingDisclosure,
  ...props
}: RequestFormProps<TSuccess, TError>) {
  const toast = useToast();
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
        loadingDisclosure?.loading();
        onSubmit?.(formData)
          .then((response) => {
            if (response) {
              onSuccess?.(response);
            }
          })
          .catch((error) => {
            setFormError(error?.response?.data?.message);
            setFormErrors(error?.response?.data?.errors);
            onError?.(error);
            if (!onError) {
              toast.error({
                title: "Error",
                description:
                  error?.response?.data?.message ||
                  "Ocorreu um erro inesperado. Por favor, tente novamente.",
              })
            }
          })
          .finally(() => {
            setFormLoading(false);
            loadingDisclosure?.complete();
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
