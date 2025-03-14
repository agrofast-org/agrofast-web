import {
  FormProps as HeroUIFormProps,
  Form as HeroUIForm,
} from "@heroui/react";
import { createContext, useContext, useState } from "react";

export interface FormProps extends HeroUIFormProps {
  children?: React.ReactNode;
  success?: (value) => void;
  error?: (error: Error) => void;
  finally?: () => void;
}

interface FormProviderProps {
  values: FormValues;
  // touched: Record<string, boolean>;
  // setValues: (values: FormValues) => void;
  // setTouched: (touched: Record<string, boolean>) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValue = any;

export type FormValues = Record<string, FormValue>;

const FormProvider = createContext<FormProviderProps | undefined>(undefined);

const Form: React.FC<FormProps> = ({ children, ...props }) => {
  const [values] = useState<FormValues>({});

  return (
    <FormProvider.Provider
      value={{
        values,
      }}
    >
      <HeroUIForm {...props}>{children}</HeroUIForm>
    </FormProvider.Provider>
  );
};

export const useForm = () => {
  return useContext(FormProvider);
};

export default Form;
