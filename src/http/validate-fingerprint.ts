import api from "@/service/api";
import { Success } from "@/types/api-response";

export type ValidateFingerprintResponse = Success<{
  data: {
    fingerprint?: string;
  };
}>;

export const validateFingerprint = (fingerprint: string) => {
  return api
    .get<ValidateFingerprintResponse>("/fingerprint", {
      headers: { "Browser-Agent": fingerprint },
    })
    .then(({ data }) => data);
};
