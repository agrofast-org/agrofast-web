import api from "@/service/api";
import { Success } from "@/types/api-response";

export type ValidateFingerprintResponse = Success;

export const validateFingerprint = (fingerprint: string) => {
  return api.get<ValidateFingerprintResponse>("/fingerprint/validate", {
    headers: { "Browser-Agent": fingerprint },
  });
};
