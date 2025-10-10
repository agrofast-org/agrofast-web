import {
  CheckCircle,
  DocumentText,
  InfoCircle,
  Upload,
} from "@solar-icons/react";
import { Button, cn, Image, Spinner, Tooltip, useDisclosure } from "@heroui/react";
import { Attachment } from "@/types/attachment";
import { ModalDialogue } from "../modal-dialogue";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRecentAttachments } from "@/http/uploads/recent-attachments";
import { uploadAttachment } from "@/http/uploads/upload-attachment";

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
          <p className="text-gray-600 dark:text-gray-300 text-small">
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
    <div
      className={cn(
        "flex gap-1 p-1 border border-default-300 rounded-medium w-full overflow-x-auto overflow-y-hidden"
      )}
    >
      {!files
        ? emptyState
        : files.map((file, idx) => <File key={idx} file={file} />)}
    </div>
  );
};

export interface FileProps {
  file: Attachment;
}

export const File: React.FC<FileProps> = ({ file }) => {
  const type = file.mime_type.split("/")[0];

  const [onFocus, setOnFocus] = useState<boolean>(false);

  return (
    <Tooltip
      content={file.name}
      placement="top"
      delay={250}
      color="foreground"
      isOpen={onFocus ? false : undefined}
      showArrow
    >
      <div
        onFocusCapture={() => {
          setOnFocus(true);
        }}
        onBlurCapture={() => {
          setOnFocus(false);
        }}
        className="relative border border-default-300 rounded-small overflow-hidden size-12 min-w-12"
      >
        <div
          className={cn(
            "z-10 absolute flex flex-col rounded-small size-full transition-[backdrop-filter,opacity] duration-75",
            onFocus
              ? "opacity-100 backdrop-blur-[2px]"
              : "backdrop-blur-0 opacity-0 pointer-events-none"
          )}
        >
          <Button
            size="sm"
            color="success"
            isIconOnly
            className="flex flex-1 justify-center bg-success/75 rounded-none rounded-t-small w-full"
          >
            <CheckCircle className="p-1 size-6 text-default-50" />
          </Button>
          <Button
            size="sm"
            isIconOnly
            className="flex flex-1 justify-center bg-primary-400/75 rounded-none rounded-b-small w-full"
          >
            <InfoCircle className="p-1 size-6 text-default-50" />
          </Button>
        </div>
        {type === "image" ? (
          <Image
            className="rounded-small overflow-hidden size-full object-cover"
            src={`${file.path}/miniature`}
            fallbackSrc=""
            alt=""
          />
        ) : (
          <DocumentText className="p-1.5 size-full text-default-400" />
        )}
      </div>
    </Tooltip>
  );
};
