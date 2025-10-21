import { api } from "@/service/api";

export const getAvailableRequests = () => {
  return api.get<Request[]>("/request/available");
};