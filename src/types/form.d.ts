export type FormValue = FormDataEntryValue;

export type FormValues = Record<string, FormValue>;

export type FormErrors = {
  code: number;
  message: string;
  errors: Record<string, string | string[]>;
};