import api from "@/service/api";

export const validateFingerprint = (fingerprint: string) => {
  return api.get("/fingerprint/validate", {
    headers: { "Browser-Agent": fingerprint },
  });
};
