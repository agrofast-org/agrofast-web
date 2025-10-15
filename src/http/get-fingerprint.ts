import { api } from "@/service/api";

type GetFingerprintResponse = string;

export const getFingerprint = () => {
  return api.get<GetFingerprintResponse>("/fingerprint");
};
