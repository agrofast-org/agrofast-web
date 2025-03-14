import api from "@/service/api";

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
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const signUp = async (data: SignUpData): Promise<SignUpResponse> => {
  const response = await api.post<SignUpResponse>("/user", data);
  return response.data;
};