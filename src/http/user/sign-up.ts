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

export interface SignUpResponse {
  token: string;
  user: User;
}

export const signUp = async (
  data: SignUpData | FormValues
): Promise<SignUpResponse> => {
  const response = await api
    .post<SignUpResponse>("/user", data)
    .then((data) => {
      console.log(data);
      return data;
    });
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${response.data.token}`;
    return config;
  });
  return response.data;
};
