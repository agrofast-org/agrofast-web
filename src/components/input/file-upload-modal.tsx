import { DocumentText, Upload } from "@solar-icons/react";
import { Button, cn, Spinner, Tooltip, useDisclosure } from "@heroui/react";
import { Attachment } from "@/types/attachment";
import { ModalDialogue } from "../modal-dialogue";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRecentAttachments } from "@/http/uploads/recent-attachments";
import { uploadAttachment } from "@/http/uploads/upload-attachment";
import ScrollShadow from "../scroll-shadow";
import Image from "../image";
import Link from "../link";

export interface FileUploadModalProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "append" | "replace";
  accept?: string | undefined;
  multiple?: boolean;
  onUpload?: (files: Attachment[]) => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  name: inputName,
  label,
  placeholder,
  disabled = false,
  required = false,
  accept,
  multiple = false,
}) => {
  const selectionDisclosure = useDisclosure();

  const fieldName = inputName || "file-upload";

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const {
    data: storedFiles,
    isLoading: storedFilesLoading,
    refetch: refetchStoredFiles,
  } = useQuery<Attachment[]>({
    queryKey: ["auth-code-length"],
    queryFn: async () => {
      const res = await getRecentAttachments();
      return res.data ?? [];
    },
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (!selected.length) return;

    setIsUploading(true);
    const attachment = new FormData();
    if (multiple) {
      selected.forEach((file) => attachment.append("files[]", file));
    } else {
      attachment.append("file", selected[0]);
    }

    uploadAttachment(attachment).finally(() => {
      setIsUploading(false);
      e.target.value = "";
      refetchStoredFiles();
    });
  };

  return (
    <div className="relative flex flex-col pt-6">
      <ModalDialogue
        title={`Selecionar arquivo${multiple ? "s" : ""}`}
        {...selectionDisclosure}
      >
        <Button
          as="label"
          htmlFor={`${fieldName}-input`}
          className="inline-flex justify-center items-center gap-2 bg-default-200 px-4 py-2 rounded-medium w-full text-default-600 cursor-pointer"
          isDisabled={disabled || isUploading}
        >
          {isUploading ? (
            <Spinner size="sm" />
          ) : (
            <Upload weight="LineDuotone" />
          )}
          Enviar arquivo{multiple ? "s" : ""}
          <input
            id={`${fieldName}-input`}
            name={`${fieldName}-input`}
            type="file"
            accept={accept}
            className="hidden"
            multiple={multiple}
            disabled={disabled || isUploading}
            required={required}
            onChange={handleUpload}
          />
        </Button>
        <div>
          <p className="text-small text-gray-600 dark:text-gray-300">
            Arquivos anexados anteriormente:
          </p>
          <HorizontalFileList files={storedFiles} />
        </div>
      </ModalDialogue>
      <span className="top-0 z-20 absolute flex justify-between w-full text-foreground text-small">
        <p>{label ?? placeholder ?? "Upload a file"}</p>
      </span>
      <Button
        className="inline-flex justify-center items-center gap-2 bg-default-200 px-4 py-2 rounded-medium w-full text-default-600 cursor-pointer"
        isDisabled={disabled || isUploading}
        onPress={selectionDisclosure.onOpen}
      >
        {isUploading ? <Spinner size="sm" /> : <Upload weight="LineDuotone" />}
        {isUploading
          ? "Carregando..."
          : 0 // : files.length
          ? "Adicionar mais"
          : placeholder ?? label ?? "Selecionar arquivo"}
        <input id={fieldName} name={fieldName} type="hidden" />
      </Button>
    </div>
  );
};

export interface HorizontalFileListProps {
  files?: Attachment[];
  emptyState?: React.ReactNode;
  onFileClick?: (file: Attachment) => void;
}

export const HorizontalFileList: React.FC<HorizontalFileListProps> = ({
  files,
  emptyState = "Sem arquivos",
}) => {
  return (
    <ScrollShadow
      className={cn(
        "flex p-1 gap-1 cus border border-default-300 rounded-medium w-full overflow-x-auto"
      )}
    >
      {!files
        ? emptyState
        : files.map((file, idx) => <File key={idx} file={file} />)}
    </ScrollShadow>
  );
};

export interface FileProps {
  file: Attachment;
}

export const File: React.FC<FileProps> = ({ file }) => {
  const type = file.mime_type.split("/")[0];

  return (
    <Tooltip content={file.name} placement="top" delay={250} color="foreground" showArrow>
      <div className="size-10 overflow-hidden border border-default-300 rounded-small">
        {type === "image" ? (
          <Image
            src={`${file.path}/miniature`}
            fallbackSrc="https://via.placeholder.com/40"
            alt=""
          />
        ) : (
          <DocumentText className="text-default-400 size-full p-1.5" />
        )}
      </div>
    </Tooltip>
  );
};
