import { api } from "@/service/api";

export const getRequestOffers = async (requestId: string) => {
  return api.get(`/requests/${requestId}/offers`);
};
