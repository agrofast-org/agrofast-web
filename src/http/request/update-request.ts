import { api } from "@/service/api";

export const updateRequest = (uuid: string) => {
  return api.get(`/request/${uuid}/update`);
};
