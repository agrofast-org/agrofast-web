import { api } from "@/service/api";

export const resendCode = () => {
  return api.get("/auth/resend-code");
};
