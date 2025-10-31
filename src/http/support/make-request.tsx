import { api } from "@/service/api";

export interface SupportRequestResponse {
    chat_uuid: string;
}

export const makeSupportRequest = (data?: FormData) => {
  return api.post<SupportRequestResponse>(`/support/request`, data);
};
