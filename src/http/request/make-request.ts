import api from "@/service/api";
import { Success } from "@/types/api-response";

type PostRequestResponse = Success;
type PostRequestData = {
  origin_place_id: string;
  destination_place_id: string;
  machine_id: string;
};

export const postRequest = (data: PostRequestData) => {
  return api.post<PostRequestResponse>("/request", data).then((res) => res.data);
};
