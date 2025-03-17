import api from "@/service/api";

export interface AuthCodeLengthResponse {
  message?: string;
  length: number;
}

export const getAuthCodeLength = () => {
  return api.get("/auth/code-length");
}