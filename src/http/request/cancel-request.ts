import { api } from "@/service/api";
  
export const cancelRequest = (uuid: string) => {
  return api.delete(`/request/${uuid}`);
};
