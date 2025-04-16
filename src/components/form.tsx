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
  useState,
} from "react";

export type Validation = () => void;
export type Validations = Record<string, ValidationError>;

export interface FormProps extends HeroUIFormProps {
  children?: React.ReactNode;
  initialData?: FormValues;
  onSubmit?: (values: FormValues) => void;
}

export interface FormProviderProps {
  values?: FormValues;
  errors: FormErrors;
  setValue: (address: string, value: FormValue) => void;
  setError: (address: string, error: ValidationError) => void;
  validations: Validations;
  setValidation: (address: string, validation: Validation) => void;
}

const FormProvider = createContext<FormProviderProps | undefined>(undefined);

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  initialData,
  validationErrors,
  ...props
}) => {
  const [values, setValues] = useState<FormValues>(
    parseNested(initialData ?? {})
  );
  const [errors, setErrors] = useState<FormErrors>(validationErrors ?? {});
  const [validations, setValidations] = useState<Validations>({});

  const setError = useCallback((address: string, error?: ValidationError) => {
    console.log("setError", address, error);
    
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

  const setValue = useCallback(
    (address: string, value?: FormValue) => {
      setValues((prevValues: FormValues) => {
        const newValues = { ...prevValues };
        if (value === undefined) {
          delete newValues[address];
          setError(address, undefined);
        } else {
          newValues[address] = value;
        }
        return newValues;
      });
    },
    [setError]
  );

  const setValidation = useCallback(
    (address: string, validation: Validation) => {
      setValidations((prevValidations: Record<string, Validation>) => {
        const newValidations = { ...prevValidations };
        if (validation === undefined) {
          delete newValidations[address];
        } else {
          newValidations[address] = validation;
        }
        return newValidations;
      });
    },
    []
  );

  const onSubmitHandle = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    Object.keys(validations).forEach((key) => {
      const validation = validations[key];
      if (validation) {
        validation();
      }
    });
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
      const data = Object.fromEntries(new FormData(event.currentTarget));
      const nestedData = toNested(data);
      console.log(data, nestedData);

      onSubmit?.(nestedData);
    }
  };

  useEffect(() => {
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    }
    console.log("validationErrors", validationErrors);
  }, [validationErrors]);

  useEffect(() => {
    if (initialData) {
      setValues(parseNested(initialData));
    }
  }, [initialData]);

  return (
    <FormProvider.Provider
      value={{
        errors,
        values,
        setValue,
        setError,
        validations,
        setValidation,
      }}
    >
      <HeroUIForm
        onSubmit={onSubmitHandle}
        validationErrors={errors}
        {...props}
      >
        {children}
      </HeroUIForm>
    </FormProvider.Provider>
  );
};

export const useForm = (): FormProviderProps | undefined => {
  return useContext(FormProvider);
};

export default Form;
