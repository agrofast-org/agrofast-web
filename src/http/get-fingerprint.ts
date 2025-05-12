import api from "@/service/api";
import { Success } from "@/types/api-response";

type GetFingerprintResponse = Success<{ data: { fingerprint: string } }>;

export const getFingerprint = () => {
  return api
    .get<GetFingerprintResponse>("/fingerprint")
    .then(({ data }) => data);
};
