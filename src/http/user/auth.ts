import api from "@/service/api";
import { User } from "@/types/user";

export interface AuthResponse {
  token: string;
  user: User;
};

export const auth = (code: string) => {
  return api.get<AuthResponse>("/user/auth", { params: { code } });
};
