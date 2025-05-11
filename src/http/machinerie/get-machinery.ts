import api from "@/service/api";
import { Success } from "@/types/api-response";
import { Machinery } from "@/types/user";

type GetMachineryResponse = Success<{
  data: Machinery[];
}>;

export const getMachinery = () => {
  return api.get<GetMachineryResponse>("/machinery").then(({ data }) => data);
};
