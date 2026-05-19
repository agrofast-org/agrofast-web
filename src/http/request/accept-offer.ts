import { api } from "@/service/api";

export const acceptOffer = (offerId: string) => {
  return api.put(`/offer/${offerId}/accept`);
};
