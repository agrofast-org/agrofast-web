import { isNumeric } from "@/lib/utils";
import {
  FormProps as HeroUIFormProps,
  Form as HeroUIForm,
} from "@heroui/react";
import { createContext, useContext } from "react";

export interface FormProps extends HeroUIFormProps {
  children?: React.ReactNode;
}

interface FormProviderProps {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValue = any;

export type FormValues = Record<string, FormValue>;

const FormProvider = createContext<FormProviderProps | undefined>(undefined);

const Form: React.FC<FormProps> = ({ children, ...props }) => {
  return (
    <FormProvider.Provider value={{}}>
      <HeroUIForm {...props}>{children}</HeroUIForm>
    </FormProvider.Provider>
  );
};

export const useForm = () => {
  return useContext(FormProvider);
};

export default Form;
