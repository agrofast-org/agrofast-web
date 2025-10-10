import { api } from "@/service/api";
import { Attachment } from "@/types/attachment";

export type UploadAttachmentResponse = Attachment[];

export const uploadAttachment = (attachment: FormData) => {
  return api.post<UploadAttachmentResponse>(
    "/uploads/attachments",
    attachment,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
