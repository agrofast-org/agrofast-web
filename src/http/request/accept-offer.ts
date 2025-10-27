import { api } from "@/service/api";

export const acceptOffer = (offerId: string) => {
  return api.post(`/offer/${offerId}/accept`);
};
