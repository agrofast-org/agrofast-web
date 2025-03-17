import api from "@/service/api";

interface GetFingerprintResponse {
}

export const getFingerprint = () => {
  return api.get<GetFingerprintResponse>("/fingerprint");
};
