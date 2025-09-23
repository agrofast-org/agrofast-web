import api from "@/service/api";

type PostRequestResponse = { request_uuid: string };
type PostRequestData = {
  origin_place_id: string;
  destination_place_id: string;
  machine_uuid: string;
};

export const postRequest = (data: PostRequestData) => {
  return api
    .post<PostRequestResponse>("/request", data)
    .then((res) => res.data);
};
