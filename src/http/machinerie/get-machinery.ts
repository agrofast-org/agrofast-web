import { api } from "@/service/api";
import { Machinery } from "@/types/user";

type GetMachineryResponse = Machinery[];

export const getMachinery = () => {
  return api.get<GetMachineryResponse>("/machinery");
};
