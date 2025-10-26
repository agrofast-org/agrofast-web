import { api } from "@/service/api";
import { Offer } from "@/types/transport";

export const makeOffer = (data: FormData) => {
  return api.post<
    | Offer
    | {
        chat_uuid: string;
      }
  >(`/offer`, data);
};
