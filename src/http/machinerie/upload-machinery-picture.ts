import { api } from "@/service/api";

type UploadedPicuture = {
  uuid: string;
  picture: string;
};

export type UploadPictureResponse = UploadedPicuture[];

export const uploadMachineryPicture = async (
  picture: FormData
) => {
  return api.post<UploadPictureResponse>("/machinery/picture/upload", picture, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
