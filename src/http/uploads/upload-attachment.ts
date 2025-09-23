import api, { apiBaseUrl } from "@/service/api";
import { Attachment } from "@/types/attachment";

export type UploadAttachmentResponse = Attachment[];

export const uploadAttachment = (
  attachment: FormData
): Promise<UploadAttachmentResponse> => {
  return api
    .post("/uploads/attachments", attachment, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      baseURL: apiBaseUrl,
    })
    .then(({ data }) => data);
};
