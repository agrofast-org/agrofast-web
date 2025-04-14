import type { FormErrors, FormValue, FormValues } from "@/types/form";
import {
  FormProps as HeroUIFormProps,
  Form as HeroUIForm,
} from "@heroui/react";
import { AxiosResponse } from "axios";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface FormProps extends HeroUIFormProps {
  children?: React.ReactNode;
  initialData?: FormValues;
  success?: (response: AxiosResponse<FormValue, FormValue>) => void;
  error?: (error: Error) => void;
  finally?: () => void;
}

export interface FormProviderProps {
  values?: FormValues;
  errors: FormErrors;
  setValue: (address: string, value: FormValue) => void;
  setError: (address: string, error: ValidationError) => void;
}

const FormProvider = createContext<FormProviderProps | undefined>(undefined);

const Form: React.FC<FormProps> = ({
  children,
  initialData,
  validationErrors,
  ...props
}) => {
  const [values, setValues] = useState<FormValues>(initialData ?? {});
  const [errors, setErrors] = useState<FormErrors>(validationErrors ?? {});

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

  useEffect(() => {
    if (
      validationErrors &&
      Object.keys(validationErrors).length > 0 &&
      validationErrors !== errors
    ) {
      setErrors(validationErrors);
    }
  }, [validationErrors, errors]);

  useEffect(() => {
    if (initialData) {
      setValues(initialData);
    }
  }, [initialData]);

  return (
    <FormProvider.Provider
      value={{
        errors,
        values,
        setValue,
        setError,
      }}
    >
      <HeroUIForm validationErrors={validationErrors} {...props}>
        {children}
      </HeroUIForm>
    </FormProvider.Provider>
  );
};

export const useForm = (): FormProviderProps | undefined => {
  return useContext(FormProvider);
};

export default Form;
