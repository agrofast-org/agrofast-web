import { api } from "@/service/api";
import { User } from "@/types/user";
import {
  CredentialResponse,
  UseGoogleLoginOptionsImplicitFlow,
} from "@react-oauth/google";

export type AuthResponse = {
  token: string;
  user: User;
  auth?: "authenticate" | "authenticated";
};

export const googleAuth = (credentials: CredentialResponse) => {
  return api.post<AuthResponse>("/auth/google-auth", credentials);
};

export const googleAuthV2 = (
  credentials: Parameters<
    NonNullable<UseGoogleLoginOptionsImplicitFlow["onSuccess"]>
  >[0]
) => {
  return api.post<AuthResponse>("/auth/google-auth/v2", credentials);
};
