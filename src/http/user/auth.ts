import { api } from "@/service/api";
import { FormValues } from "@/types/form";
import { User } from "@/types/user";

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthError = {
  attempts: number;
  error?: string;
};

export const auth = (data: FormValues) => {
  return api.get<AuthResponse>("/auth", { params: { code: data.code } });
};
