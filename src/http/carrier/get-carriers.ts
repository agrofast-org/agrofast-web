import { api } from "@/service/api";
import { Carrier } from "@/types/user";

type GetCarrierResponse = Carrier[];

export const getCarrier = () => {
  return api.get<GetCarrierResponse>("/carrier");
};
