import api from "@/service/api";
import { FormValues } from "@/types/form";
import { User } from "@/types/user";

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const login = async (data: LoginData | FormValues): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/user/login", data);
  api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${response.data.token}`;
    return config;
  });
  return response.data;
};