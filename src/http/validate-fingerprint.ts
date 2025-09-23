import api from "@/service/api";

export type ValidateFingerprintResponse = string;

export const validateFingerprint = (fingerprint: string) => {
  return api
    .get<ValidateFingerprintResponse>("/fingerprint", {
      headers: { "Browser-Agent": fingerprint },
    })
    .then(({ data }) => data);
};
