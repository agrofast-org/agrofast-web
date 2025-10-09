import { Upload } from "@solar-icons/react";
import { Button, cn, Spinner, useDisclosure } from "@heroui/react";
import { Attachment } from "@/types/attachment";
import { ModalDialogue } from "../modal-dialogue";
import { useState } from "react";
import { FileUpload } from "./file-upload";

export type FileAcceptedTypes =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/gif"
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export interface FileUploadModalProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "append" | "replace";
  accept?: FileAcceptedTypes[];
  multiple?: boolean;
  onUpload?: (files: Attachment[]) => void;
}

const STORAGE_KEY = (formId: string, fieldName: string) =>
  `file-upload:${formId}:${fieldName}`;

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

  const [isUploading] = useState<boolean>(false);

  return (
    <div className="relative flex flex-col pt-6">
      <ModalDialogue
        title={`Selecionar arquivo${multiple ? "s" : ""}`}
        {...selectionDisclosure}
      >
        <FileUpload
          // accept={accept?.join(",")
          className="hidden"
          multiple={multiple}
          disabled={disabled || isUploading}
          required={required}
        />
        <div className="">
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Arquivos anexados anteriormente:
          </p>
          <div>
            {/* List of uploaded files */}
          </div>
        </div>
      </ModalDialogue>
      <span className="top-0 z-20 absolute flex justify-between w-full text-foreground text-small">
        <p>{label ?? placeholder ?? "Upload a file"}</p>
        {/* <Button
          className={cn(
            "bg-default-200 !min-w-5 !max-w-5 !size-5 text-default-600",
            files.length ? "" : "opacity-0"
          )}
          onPress={onOpen}
          isDisabled={!files.length}
          isIconOnly
        >
          i
        </Button> */}
      </span>
      <Button
        className="inline-flex justify-center items-center gap-2 bg-default-200 px-4 py-2 rounded-medium w-full text-default-600 cursor-pointer"
        isDisabled={disabled || isUploading}
        onPress={selectionDisclosure.onOpen}
      >
        {isUploading ? <Spinner size="sm" /> : <Upload weight="LineDuotone" />}
        {isUploading
          ? "Carregando..."
          : 0
          ? // : files.length
            "Adicionar mais"
          : placeholder ?? label ?? "Selecionar arquivo"}
        <input id={fieldName} name={fieldName} type="hidden" />
      </Button>
    </div>
  );
};
