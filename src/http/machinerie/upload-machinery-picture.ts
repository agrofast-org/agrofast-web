import api from "@/service/api";
import { Success } from "@/types/api-response";

type UploadedPicuture = {
  uuid: string;
  picture: string;
}

export type UploadPictureResponse = Success<{
  picture_list: UploadedPicuture[];
}>;

export const uploadMachineryPicture = async (
  picture: FormData
): Promise<UploadPictureResponse> => {
  return api.post("/machinery/picture/upload", picture, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
