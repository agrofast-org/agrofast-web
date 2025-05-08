import api from "@/service/api";
import { Success } from "@/types/api-response";
import { Carrier } from "@/types/user";

type GetCarrierResponse = Success<Carrier[]>;

export const getCarrier = () => {
  return api.get<GetCarrierResponse>("/carrier");
};
