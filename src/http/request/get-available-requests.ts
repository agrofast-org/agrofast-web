import { api } from "@/service/api";
import { Request } from "@/types/transport";

export const getAvailableRequests = () => {
  return api.get<Request[]>("/request/available");
};
