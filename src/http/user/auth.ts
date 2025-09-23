import api from "@/service/api";
import { User } from "@/types/user";

export type AuthResponse = {
  token: string;
  user: User;
};

export type AuthError = {
  attempts: number;
};

export const auth = (code: string) => {
  return api
    .get<AuthResponse>("/user/auth", { params: { code } })
    .then(({ data }) => data);
};
