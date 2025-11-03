import { api } from "@/service/api";

type PostRequestResponse = { request_uuid: string };
type PostRequestData = {
  origin_place_id?: string | null;
  destination_place_id?: string | null;
  machine_uuid?: string | null;
  desired_date?: string | null;
};

export const postRequest = (data: PostRequestData) => {
  return api.post<PostRequestResponse>("/request", data);
};
