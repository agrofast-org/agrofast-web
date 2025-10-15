"use client";
import { parseNested, toNested } from "@/lib/nested";
import type { FormErrors, FormValue, FormValues } from "@/types/form";
import {
  FormProps as HeroUIFormProps,
  Form as HeroUIForm,
} from "@heroui/react";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";

export type Validation = () => void;
export type Validations = Record<string, Validation>;
export type Getter = () => FormValue | FormValue[] | undefined;
export type Getters = Record<string, Getter>;

export interface FormProps extends HeroUIFormProps {
  children?: React.ReactNode;
  initialData?: FormValues;
  onSubmit?: (values: FormValues) => void;
}

export interface FormProviderProps {
  formId: string;
  values?: FormValues;
  setValue: (address: string, value: FormValue | FormValue[]) => void;
  errors: FormErrors;
  setError: (address: string, error: ValidationError) => void;
}

const FormProvider = createContext<FormProviderProps | undefined>(undefined);

export const Form: React.FC<FormProps> = ({
  id,
  children,
  onSubmit,
  initialData,
  validationErrors,
  ...props
}) => {
  const reactId = useId();

  const [formId, setFormId] = useState("");

  useEffect(() => {
    if (id) {
      setFormId(id);
      return;
    }
    setFormId(`form-${reactId}`);
  }, [id, reactId]);

  const [values, setValues] = useState<FormValues>(
    parseNested(initialData ?? {})
  );

  const [errors, setErrors] = useState<FormErrors>(validationErrors ?? {});

  const setValue = useCallback(
    (address: string, value: FormValue | FormValue[]) => {
      setValues((prevValues: FormValues) => {
        const newValues = { ...prevValues };
        if (Array.isArray(value)) {
          newValues[address] = value;
        } else {
          newValues[address] = value;
        }
        return newValues;
      });
    },
    [setValues]
  );

  const setError = useCallback((address: string, error?: ValidationError) => {
    setErrors((prevErrors: FormErrors) => {
      const newErrors = { ...prevErrors };
      if (error === undefined) {
        delete newErrors[address];
      } else {
        newErrors[address] = error;
      }
      return newErrors;
    });
  }, []);

  const onSubmitHandle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const nestedData = {
      ...toNested({ ...formData, ...values }),
    };

    onSubmit?.(nestedData);
    return;
  };

  useEffect(() => {
    if (validationErrors) {
      setErrors(validationErrors);
    }
  }, [validationErrors]);

  useEffect(() => {
    if (initialData) {
      setValues(parseNested(initialData));
    }
  }, [initialData]);

  return (
    <>
      <FormProvider.Provider
        value={{
          formId,
          values,
          setValue,
          errors,
          setError,
        }}
      >
        <HeroUIForm
          onSubmit={onSubmitHandle}
          validationErrors={errors}
          {...props}
          id={formId}
        >
          {children}
        </HeroUIForm>
      </FormProvider.Provider>
    </>
  );
};

export const useForm = (): FormProviderProps | undefined => {
  return useContext(FormProvider);
};
