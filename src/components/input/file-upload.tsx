import { cn } from "@/lib/utils";
import { Upload } from "@solar-icons/react";
import { useToast } from "@/service/toast";
import { useEffect, useState, useMemo } from "react";
import { useForm } from "../form/form";
import { useGroup } from "./group/input-group";
import { Button, Spinner, useDisclosure } from "@heroui/react";
import ModalDialogue from "../modal-dialogue";
import FileList from "../file-list";
import { useRouter } from "next/router";
import api from "@/service/api";

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

export interface UploadedFile {
  uuid: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface FileUploadProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  type?: "append" | "replace";
  accept?: FileAcceptedTypes[];
  multiple?: boolean;
  onUpload?: (files: UploadedFile[]) => void;
}

const STORAGE_KEY = (formId: string, fieldName: string) =>
  `file-upload:${formId}:${fieldName}`;

const FileUpload: React.FC<FileUploadProps> = ({
  name: inputName,
  label,
  placeholder,
  disabled = false,
  required = false,
  type = "replace",
  accept,
  multiple = false,
  onUpload,
}) => {
  const router = useRouter();
  const toast = useToast();
  const disclosure = useDisclosure();
  const { onOpen } = disclosure;

  const form = useForm();
  const group = useGroup();
  const fieldName =
    inputName && group ? group.getFieldName(inputName) : inputName!;

  const formId = form?.formId ?? router.pathname;
  const storageKey = useMemo(
    () => STORAGE_KEY(formId, fieldName),
    [formId, fieldName]
  );

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!form || !storageKey) return;
    const savedFiles = sessionStorage.getItem(storageKey);
    if (savedFiles) {
      try {
        const parsedFiles: UploadedFile[] = JSON.parse(savedFiles);
        if (Array.isArray(parsedFiles)) {
          if (JSON.stringify(form.values?.[fieldName]) !== JSON.stringify(parsedFiles)) {
            setFiles(parsedFiles);
            form.setValue(fieldName, parsedFiles);
          }
        }
      } catch {
        sessionStorage.removeItem(storageKey);
      }
    }
  }, [storageKey, fieldName, form]);

  useEffect(() => {
    if (!form?.getters[fieldName]) {
      form?.setGetter(fieldName, () => files);
    }
  }, [files, fieldName, form]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    if (!selected.length) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      if (multiple) {
        selected.forEach((file) => data.append("files[]", file));
      } else {
        data.append("file", selected[0]);
      }

      const res = await api.post("/uploads/attachment/attach", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      const returned = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data ?? res.data];

      const uploaded: UploadedFile[] = returned.map(
        (entry: UploadedFile, idx: number) => ({
          uuid: entry.uuid,
          url: entry.url,
          name: selected[idx]?.name,
          size: selected[idx]?.size,
          type: selected[idx]?.type,
        })
      );

      const updated = type === "append" ? [...files, ...uploaded] : uploaded;

      setFiles(updated);
      form?.setValue(fieldName, updated);
      sessionStorage.setItem(storageKey, JSON.stringify(updated));
      onUpload?.(updated);

      toast.success({ description: "Arquivos enviados com sucesso" });
    } catch {
      toast.error({
        title: "Erro no upload",
        description: "Tente novamente",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const fileNames = files.map((f) => f.name).join(", ");

  return (
    <div className="relative flex flex-col pt-6">
      <ModalDialogue title="Arquivos" {...disclosure}>
        <FileList files={files} />
      </ModalDialogue>

      <span className="top-0 z-20 absolute flex justify-between w-full text-foreground text-small">
        <p>{label ?? placeholder ?? "Upload a file"}</p>
        <Button
          className={cn(
            "!min-w-5 !max-w-5 !size-5",
            files.length ? "" : "opacity-0"
          )}
          onPress={onOpen}
          isDisabled={!files.length}
          isIconOnly
        >
          i
        </Button>
      </span>

      <Button
        as="label"
        htmlFor={fieldName}
        className="inline-flex justify-center items-center gap-2 px-4 py-2 rounded-medium w-full cursor-pointer"
        isDisabled={disabled || isUploading}
      >
        {isUploading ? <Spinner size="sm" /> : <Upload />}
        {isUploading
          ? "Enviando..."
          : files.length
          ? "Adicionar mais"
          : placeholder ?? label ?? "Selecionar arquivo"}
        <input
          id={fieldName}
          name={fieldName}
          type="file"
          accept={accept?.join(",")}
          className="hidden"
          multiple={multiple}
          disabled={disabled || isUploading}
          required={required}
          onChange={handleUpload}
        />
      </Button>

      {files.length > 0 && (
        <span className="mt-1 text-xs truncate" title={fileNames}>
          {fileNames}
        </span>
      )}
    </div>
  );
};

export default FileUpload;
