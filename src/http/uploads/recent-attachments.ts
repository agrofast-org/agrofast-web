import { api } from "@/service/api";
import { Attachment } from "@/types/attachment";

export type UploadAttachmentResponse = Attachment[];

export const getRecentAttachments = () => {
  return api.get<UploadAttachmentResponse>("/uploads/attachments");
};
