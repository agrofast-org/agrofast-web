import { api } from "@/service/api";
import { Request } from "@/types/transport";

export const getRequest = (uuid: string) => {
  return api.get<Request>(`/request/${uuid}`);
};
