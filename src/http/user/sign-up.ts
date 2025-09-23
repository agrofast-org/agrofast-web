import api from "@/service/api";
import { FormValues } from "@/types/form";
import { User } from "@/types/user";

export interface SignUpData {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirm: string;
  remember?: boolean;
  terms_and_privacy_agreement: boolean;
  language: string;
}

export type SignUpResponse = {
  token: string;
  user: User;
};

export const signUp = (
  data: SignUpData | FormValues
): Promise<SignUpResponse> => {
  return api.post<SignUpResponse>("/user", data).then(({ data }) => {
    api.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${data.token}`;
      return config;
    });
    return data;
  });
};
