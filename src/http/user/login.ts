import { api } from "@/service/api";
import { FormValues } from "@/types/form";
import { User } from "@/types/user";

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export type LoginResponse = {
  token: string;
  user: User;
  auth?: "authenticate" | "authenticated";
};

export const login = (data: LoginData | FormValues) => {
  return api.post<LoginResponse>("/user/login", data);
};
