import { api } from "@/service/api";

export type AuthCodeLengthResponse = number;

export const getAuthCodeLength = () => {
  return api.get<AuthCodeLengthResponse>("/auth/code-length");
};
